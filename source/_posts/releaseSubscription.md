---
title: 简单发布订阅实现
categories: javascript基础
tags:
  - 发布订阅
  - Array
  - 数组的特殊用法
date: 2020-6-03 
cover: /image/cover/javascript.jpg
---

## 任务需求

1. eventBus.$on(type, fn) 实现对**type**事件的订阅
2. eventBus.$emit(type, data) 实现对**type**事件的发布
3. eventBus.$off(type) 取消对**type**事件的订阅
4. eventBus.$once(type, fn) 实现对**type**事件只监听一次后取消监听

## 实现思路

1. 用一个对象对存储所有type

    ```javascript
    let obj = {
        type1: ...,
        type2: ....,
        ...
    }
    ```

2. 使用数组存储一个type的所有订阅事件

    ```javascript
    let obj = {
        type1: [fn1, fn2, ...],
        type2: [fn1, fn2, ...],
        ...
    }
    ```

3. 在发布事件触发时对数组里面的对应type的数组逐一调用并传递参数

## 代码实现

```javascript
const eventBus = {
    eventData: {},
    $on (type, fn) {
        this.eventData[type] = this.eventData[type] || [];
        this.eventData[type].push(fn);
    },
    $emit (type, message) {
        this.eventData[type] && (this.eventData[type] = this.eventData[type].filter((item, index) => {
            item(message);
            if(item.once) return false;
            return true;
        }))
    },
    $once (type, fn) {
        this.eventData[type] = this.eventData[type] || [];
        fn.once = true;
        this.eventData[type].push(fn);
    },
    $off (type) {
        this.eventData[type] = [];
    }
}

```