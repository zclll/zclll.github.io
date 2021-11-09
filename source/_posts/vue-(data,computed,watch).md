---
title: vue：watch，computed
categories: vue
tags:
  - vue
  - js
date: 2020-11-03 20:33:36
cover: /image/cover/javascript.jpg
---

### 重写结果

实现基本的数据劫持、computed缓存、watch

```javascript
import Vue from "./vue";

let vm = new Vue({
  data() {
    return {
      a: 1,
      b: 2,
    };
  },

  computed: {
    total(){
      return this.a + this.b;
    },
  },

  watch: {
    a (newValue, oldValue) {
      console.log("a", "newValue", newValue);
      console.log("a", "oldValue", oldValue)
    },

    b (newValue, oldValue) {
      console.log("b", "newValue", newValue);
      console.log("b", "oldValue", oldValue)
    }
  },
});

console.log(vm.a);// 1
console.log(vm.total);// 3
console.log(vm.b);// 2


vm.a = 100
console.log(vm.a);// 100
console.log(vm.total);// 102
console.log(vm.b);// 2

vm.b = 200
console.log(vm.a);// 100
console.log(vm.total);// 300
console.log(vm.b);// 200
```

### 重写思路

#### 暴露外部js

1. 路径：/vue/index
2. 思路：整合reactive、computed和watch并暴露vue的构造函数
3. 代码

```javascript
import reactive from "./reactive"
import Computed from './computed'
import Watcher from './watch'

class Vue {
  constructor (options){
    const { data, computed, watch } = options
    this.$data = data()

    this.init(computed, watch)
  }

  init(computed, watch){
    this.initData()
    this.$computed =  this.initComputed(computed)
    this.$watch =  this.initWatcher(watch)
  }


  initData(){
    reactive(this, (key,value)=>{

    }, (key, newValue, oldValue)=>{
      if(newValue === oldValue) return
      this.$computed.update(key)
      this.$watch.trigger(key, newValue, oldValue)
    })
  }

  initComputed(computed){
    let computedIns = new Computed()
    for(let key in computed){
      computedIns.addComputed(this, computed, key)
    }
    
    return computedIns
  }

  initWatcher(watch){
    let watcherIns = new Watcher()
    for(let key in watch){
      watcherIns.addWatcher(this, watch, key)
    }

    return watcherIns
  }
}



export default Vue
```
  
#### reactive数据劫持

1. 路径：/vue/reactive.js
2. 思路：利用Object.defineProperty实现数据劫持并利用回调返回get，set
3. 代码

```javascript
function reactive (vm, __get__, __set__){
  const _data = vm.$data

  for(let key in _data){
    Object.defineProperty(vm, key, {
      get(){
        __get__(key, _data[key])
        return _data[key]
      },

      set(newValue){
        const oldValue = _data[key]
        _data[key] = newValue
        __set__(key, newValue, oldValue)
      }
    })
  }
}

export default reactive
```

#### computed计算属性

1. 路径：/vue/computed
2. 思路：用数组保存所有的computed数据，并将计算属性名称挂载在实例上，数据结构为

    ```python
                  key(计算属性的名称)
    对象数组 -->  value(缓存的计算属性返回的值)
                  dep(计算属性需要更新的变量)
                  get(计算属性求值的函数)
    ```

3. 代码

```javascript
class Computed {
	constructor() {
		this.computedData = [];
	}

	addComputed(vm, computed, key) {
		const descript = Object.getOwnPropertyDescriptor(computed, key);

		const descriptFn = descript.value.get ? descript.value.get : descript.value,
			get = descriptFn.bind(vm),
			value = get(),
			dep = this._collectDep(descriptFn);

    this.computedData.push({
      get,
      key,
      value,
      dep
    })

    let _data = this.computedData.find(item => item.key == key)

    Object.defineProperty(vm, key, {
      get(){
        return _data.value
      }
    })
	}

  update(key, cb){
    this.computedData.forEach(item=>{
      let _key = item.dep.find(itemKey => itemKey == key)
      if(_key){
        item.value = item.get()
        cb && cb()
      }
    })
  }


  _computedDataPush(options){
    this.computedData.push(options)
  }

	_collectDep(fn) {
		let match = fn.toString().match(/this\.([a-zA-Z_]+)/g);
		return match.map(item=>item.split(".")[1])
	}
}

export default Computed;

```

#### watch监听器

1. 路径：/vue/watch
2. 思路:用数组保存所有watch数据，数据结构为

    ```python
                  key(监听器的名称)
    对象数组 -->   watchFn(监听变化执行的函数)
    ```

3. 代码：

```javascript
class Watcher {
  constructor(){
    this.watcherData = []
  }

  addWatcher(vm, watch, key){
    this._addWatchData(vm, key, watch[key])
  }


  trigger(key, newValue, oldValue){
    this.watcherData.forEach(item=>{
      if(item.key == key){
        item.watchFn(newValue, oldValue)
      }
    })
  }


  _addWatchData(vm, key, watchFn){
    this.watcherData.push({
      key,
      watchFn:watchFn.bind(vm)
    })
  }
}

export default Watcher
```

### 总结

1. 灵活使用回调函数
2. object.definproperty的使用
3. computed解决方案
4. 尽可能为以后扩展留回调
