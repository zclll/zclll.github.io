---
title: javascript - 基础(Array对象)
categories: javascript
tags:
    - javascript
    - Array
date: 2018-10-06
cover: /image/cover/javascript.jpg
---

### Array 描述

`JavaScript` 的 `Array` 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。
数组是一种类列表对象，它的原型中提供了遍历和修改元素的相关操作。JavaScript 数组的长度和元素类型都是非固定的。因为数组的长度可随时改变，并且其数据在内存中也可以不连续，所以 JavaScript 数组不一定是密集型的，这取决于它的使用方式。

### 数组的方法

1. **数组forEach**

    Array.prototype.forEach(callback,thisArg)

    - callback回调函数: 参数包括(currentValue ,index, array)
    - thisArg(可选): callback中的this指向(当callback为箭头函数时无效)
    - returns返回值: undefined

    **数组遍历**重写

    ```javascript
   Array.prototype.myForEach = function(cb){
        var _arr = this
        var _len = this.length
        var thisArg = arguments[1] || window
        for(let i = 0; i < _len; i ++){
            cb.apply(thisArg,[_arr[i],i,_arr])
        }
    }
    ```

2. **数组map**

    Array.prototype.map(callback,thisArg)

    - callback回调函数: 参数包括(currentValue ,index, array)
    - thisArg(可选): callback中的this指向(当callback为箭头函数时无效)
    - returns返回值: 返回由原数组映射出来的新数组，该数组中的每个元素是调用一次提供的函数后的返回值。

    **数组map**重写

    ```javascript
    Array.prototype.myMap = function (cb){
        var _arr = this;
        var _len = this.length
        var _arg = arguments[1] || window
        var result = []
        for(let i = 0 ;i < _len ; i ++){
            result.push(cb.apply( _arg, [_arr[i], i, _arr]))
        }
        return result
    }

    ```

3. **数组filter**

    Array.prototype.filter(callback,thisArg)

    - callback回调函数: 参数包括(currentValue ,index, array)
    - thisArg(可选): callback中的this指向(当callback为箭头函数时无效)
    - returns返回值: 返回由原数组映射出来的新数组，该数组中的每个元素是调用一次提供的函数后的返回值是否为true；如果为true则将该项添加至新数组，反之不添加。

    **数组filter**重写

    ```javascript
    Array.prototype.myFilter = function (cb){
        var _arr = this
        var _len = this.length
        var _arg = arguments[1] || window
        var result = []
        for(var i = 0; i < _len; i ++){
            cb.apply(_arg, [_arr[i], i, _arr]) ? result.push(_arr[i]) : ""
                
        }
        return result
    }
    ```

4. **数组every**

    Array.prototype.every(callback,thisArg)

    - callback回调函数: 参数包括(currentValue ,index, array)
    - thisArg(可选): callback中的this指向(当callback为箭头函数时无效)
    - returns返回值: 调用一次提供的函数后的返回值，如果全为真则返回true否则返回false

    **数组every**重写

    ```javascript
    Array.prototype.myEvery = function (cb){
        var _arr = this
        var _len = this.length
        var _arg = arguments[1] || window
        for(var i = 0; i < _len; i ++){
            if(cb.apply(_arg, [_arr[i], i, _arr])){
                continue;
            }
            return false
        }
        return true
    }
    ```

5. **数组some**

    Array.prototype.some(callback,thisArg)

    - callback回调函数: 参数包括(currentValue ,index, array)
    - thisArg(可选): callback中的this指向(当callback为箭头函数时无效)
    - returns返回值: 调用一次提供的函数后的返回值，如果有一个为真则返回true否则返回false

    **数组some**重写

    ```javascript
    Array.prototype.mySome = function (cb){
        var _arr = this
        var _len = this.length
        var _arg = arguments[1] || window
        for(var i = 0; i < _len; i ++){
            if(!cb.apply(_arg, [_arr[i], i, _arr])){
                continue;
            }
            return false
        }
        return true
    }
    ```

6. **数组reduce**

    Array.prototype.reduce(callback,initialValue)

    - callback回调函数：参数包括(accumulator, currentValue ,index, array)
    - initialValue: accumulator初始值不传的话默认为数组第一项; 在没有初始值的空数组上调用 `reduce` 将报错。

    **数组reduce**重写

    ```javascript
    Array.prototype.myReduce = function(cb){
        var _arr = this,
            _len = this.length,
            flag = arguments[1] === undefined,
            _initIndex = flag ? 1 : 0,
            _initialValue =  flag ?  _arr[0] : arguments[1]
        for(var i = _initIndex; i < _len; i ++){
            _initialValue = cb(_initialValue, _arr[i], i, _arr)
        }
        return _initialValue
    }
    ```

7. **数组reduceRight**

    Array.prototype.reduceRight(callback,initialValue)

    - callback回调函数：参数包括(accumulator, currentValue ,index, array)
    - initialValue: accumulator初始值不传的话默认为数组第一项; 在没有初始值的空数组上调用 `reduceRight` 将报错。

    **数组reduceRight**重写

     ```javascript
    Array.prototype.myReduceRight = function(cb){
        var _arr = this
        var _len = this.length
        var flag = arguments[1] === undefined
        var _initIndex = flag ? _len - 2  : _len - 1
        var _initialValue =  flag ?  _arr[_len - 1] : arguments[1]
        for(var i = _initIndex; i >= 0; i --){
            _initialValue = cb(_initialValue, _arr[i], i, _arr)
        }
        return _initialValue
    }
    ```
