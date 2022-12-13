---
title: vue3.0-依赖收集
categories: vue
tags:
  - vue
date: 2022-10-05
cover: /image/cover/javascript.jpg
---

## 简单实现vue3.0的数据劫持和依赖收集

#### 目录结构

- index.html
- js
  - index.js (使用对应函数)
  - collect
    - index.js (导出响应的函数)
    - reactive.js (数据劫持)
    - effact.js (watch等副作用函数)
    - Dep.js  (依赖收集)
    - ComputedRef.js (计算属性数据劫持)

#### 实现内容
实现`js/index.js`中能正常使用各个函数并保证逻辑正确
```javascript
// js/index.js
import {
  reactive,
  watchEffect,
  watch,
  computed
} from "./collect/index.js"

const aBtn = document.querySelector("#aBtn");
const cBtn = document.querySelector("#cBtn");

const state = reactive({
  a: 1,
  b: {
    c: 2
  }
})

const res = computed(() => state.a + state.b.c);


aBtn.addEventListener('click', () => {
  state.a = 100
  console.log('computed state.a + state.b.c',res);
}, false)

cBtn.addEventListener('click', () => {
  state.b.c = 200
  console.log('computed state.a + state.b.c',res);
}, false)

watchEffect(() => {
  console.log("watchEffect state.a", state.a);
})

watchEffect(() => {
  console.log("watchEffect state.b.c", state.b.c);
})

watch(() => state.a, (newValue, oldValue) => {
  console.log("watch state.a",newValue, oldValue)
})

watch(() => state.b.c, (newValue, oldValue) => {
  console.log("watch state.b.c", newValue, oldValue);
})

```

#### 实现思路
1. 使用proxy实现数据劫持
2. 在获取数据时进行依赖收集
3. 在设置数据时进行广播

##### 数据劫持
在`js/collect/reactive.js`中实现数据劫持
```javascript
// js/collect/reactive.js
import Dep from "./Dep" // 依赖收集，类似发布订阅
const dep = new Dep()

export function reactive (data) {
  return new Proxy(data, {
    get(target, key) {
      let value = Reflect.get(target, key)
      dep.collect(target, key) // 依赖收集
      return value != null && typeof value === 'object' ? reactive(value) : value // 递归数据劫持
    },
    set(target, key, value) {
      const oldValue = target[key]
      const returnValue = Reflect.set(target, key, value)
      dep.notify(target, key, value, oldValue) // 广播
      return returnValue
    }
  })
}
```

#### 副作用函数
在`js/collect/effect.js`中实现副作用函数

```javascript
// js/collect/effect.js

import Dep from "./Dep"
import ComputedRef from "./computedRef"

export function watchEffect(callBack) {
  Dep.effectDB = callBack; // 利用静态属性传递对应的回调函数
  callBack() // 函数调用，如果用到数据劫持的数据会触发get
  Dep.effectDB = null // 收集完成后重值为null
}

export function watch(fn, callback) {
  Dep.effectDB = callback; // 利用静态属性传递对应的回调函数
  fn() // 函数调用，如果用到数据劫持的数据会触发get
  Dep.effectDB = null // 收集完成后重值为null
}

export function computed(callback) {
  Dep.effectDB = callback; // 利用静态属性传递对应的回调函数
  const value = callback() // 函数调用，如果用到数据劫持的数据会触发get
  const computedRef = new ComputedRef (value) // 对数据进行包装
  Object.defineProperty(callback, 'computedRef', { // 设置一个不可变不可配置不可枚举的参数来识别是否需要获取函数对应的值
    value: computedRef 
  })
  Dep.effectDB = null; // 收集完成后重值为null
  return computedRef //返回值并且和callback的computedRef保持统一引用值，callback上的computedRef变化，返回值跟着变化
}
```

#### 依赖收集
在`js/collect/Dep.js`中实现依赖收集

```javascript
// js/collect/Dep.js

// 收集保存逻辑
WeakMap {
  target ----> Map
  ...
    Map {
      key ----> Set
      ...
        Set {
          [callback1, callback2, ...]
        }
    }
}

export default class Dep {
  static effectDB = null;

  constructor () {
    this.effectMap = new WeakMap() // 创建顶层的WeakMap
  }

  collect(target, key) { // 依赖收集
    if(Dep.effectDB === null) return; //如果没有回调函数则直接return

    if(!this.effectMap.get(target)) {  // 如果没有创建target对应的Map则创建
      this.effectMap.set(target, new Map())
    }
    
    if(!this.effectMap.get(target).get(key)){ // 如果没有key对应的Set则创建
      this.effectMap.get(target).set(key, new Set())
    }

    this.effectMap.get(target).get(key).add(Dep.effectDB) //给Set添加对应的callback


      
  }

  notify(target, key, newValue, oldValue) {  // 广播
    if(this.effectMap?.get(target)?.get(key)) {  // 如果拥有对应的callbackSet则依次执行
      this.effectMap.get(target).get(key).forEach(fn => {
        if(fn.computedRef) {  // 判断是否是computed的回调，如果是则赋值，反之则执行
          fn.computedRef.value = fn(newValue, oldValue) 
        }else {
          fn(newValue, oldValue)
        }
      })
    }
  }
}
```

#### computedRef 劫持
在`js/collect/computedRef.js`中实现依赖收集

```javascript
// js/collect/computedRef.js
export default class ComputedRef {
  constructor(data) {
    this._value = data
  }

  get value () {
    return this._value
  }

  set value (newValue) {
    this._value = newValue
  }
}
```

#### 函数导出
在`js/collect/index.js`中统一导出

```javascript
// js/collect/index.js
export {
  reactive
} from "./Reactive.js"

export {
  watchEffect,
  watch,
  computed
} from "./Effect"
```