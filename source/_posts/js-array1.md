---
title: javascript - 基础(Array对象)实现队列
categories: javascript基础
tags:
    - javascript
    - Array
    - 数组的特殊用法
date: 2019-10-06
cover: /image/cover/javascript.jpg
---

## 数组的特殊用法 - 队列

### 需求

1. 定义一个lazyMan函数
2. 实现以下方法

    ```javascript
         
          1.
          lazyMan("hank")
          “!,my name is hank” //打印
          lazyMan("hank").sleep(10).eat("apple")
         
          2.
          lazyMan("hank").sleep(10).eat("apple")
          “!,my name is hank” //打印
          // wating 10s
          "sleep after 10s" //打印
          "eat apple" //打印
         
          3.
          lazyMan("hank").eat("apple").eat("food")
          “!,my name is hank” //打印
          "eat apple" //打印
          "eat food" //打印
         
          4.
          lazyMan("hank").sleepFirst(5).eat("apple")
          // wating 5s
          "sleep after 5s"
          “!,my name is hank”, //打印
          "eat apple" //打印
        
    ```

### 实现步骤

1. 为了函数调用后可以持续调用函数，函数调用后返回一个api对象保证链式调用
2. 将所有函数执行保存在一个数组当中
3. 从数组中弹出第一项并执行
4. 在每一次函数调用结束后再从数组中弹出第一项的函数执行
5. 直到数组项弹出undefind为止

### 实现代码

```javascript
    function lazyMan(name) {
        let theQueue = [];
        const next = () => {
            const fn = theQueue.shift();
            fn && fn()
        };

        setTimeout(() => next(), 0);

        theQueue.push(() => {
            console.log("!,my name is" + name);
            next();
        });

        const api = {
            sleep(number) {
                theQueue.push(() => setTimeout(() => {
                    console.log("sleep after " + number + "s");
                    next()
                }, number * 1000));
                return api;
            },
            eat(content) {
                theQueue.push(() => {
                    console.log("eat " + content);
                    next();
                });
                return api;
            },
            sleepFirst(number) {
                theQueue.unshift(() => setTimeout(() => {
                    console.log("sleep after" + number + "s");
                    next()
                }, number * 1000));
                return api;
            },
        };

        return api;
    }
    ```
