---
title: javascript - 随手摘要(let,const,var)
categories: javascript基础
tags:
    - javascript
date: 2020-11-23
cover: /image/cover/javascript.jpg
---

1. var命令会发生“**变量提升**”现象，即变量可以在声明之前使用，值为undefined。

2. 如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。这在语法上，称为“**暂时性死区**”（temporal dead zone，简称 TDZ）

3. 下面代码正确运行，输出了 3 次abc。这表明**函数内部的变量i与循环变量i不在同一个作用域**，有各自单独的作用域（同一个作用域不可使用 let 重复声明同一个变量）。

    ```javascript
    for (let i = 0; i < 3; i++) {
    let i = 'abc';
    console.log(i);
    }
    // abc
    // abc
    // abc
    ```

4. 浏览器实现差异（其他环境的实现不用遵守，还是将块级作用域的函数声明当作**let**处理。
    - 允许在块级作用域内声明函数。
    - 函数声明类似于**var**，即会提升到全局作用域或函数作用域的头部。
    - 同时，函数声明还会提升到所在的块级作用域的头部。
    > 环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

5. ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。

    ```javascript
    // 第一种写法，报错
    if (true) let x = 1;

    // 第二种写法，不报错
    if (true) {
        let x = 1;
    }

    // 不报错
    'use strict';
    if (true) {
        function f() {}
    }

    // 报错
    'use strict';
        if (true) function f() {}
    ```

6. const实际上保证的，**并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动**。

    ```javascript
    const a = [];
    a.push('Hello'); // 可执行
    a.length = 0;    // 可执行
    a = ['Dave'];    // 报错
    ```

7. 如果真的想将对象冻结，应该使用Object.freeze方法。

    ```javascript
    const foo = Object.freeze({});

    // 常规模式时，下面一行不起作用；
    // 严格模式时，该行会报错
    foo.prop = 123;
    ```

8. 除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。

    ```javascript
    var constantize = (obj) => {
        Object.freeze(obj);
        Object.keys(obj).forEach( (key, i) => {
            if ( typeof obj[key] === 'object' ) {
            constantize( obj[key] );
            }
        });
    };
    ```

9. es6 申明变量的6种方式。
    - var命令
    - function命令
    - let 命令
    - const 命令
    - import命令
    - class命令

10. javaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

    ```javascript
    // 方法一
    (typeof window !== 'undefined'
    ? window
    : (typeof process === 'object' &&
        typeof require === 'function' &&
        typeof global === 'object')
        ? global
        : this);

    // 方法二
    var getGlobal = function () {
        if (typeof self !== 'undefined') { return self; }
        if (typeof window !== 'undefined') { return window; }
        if (typeof global !== 'undefined') { return global; }
        throw new Error('unable to locate global object');
    };

    // ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，
    //任何环境下，globalThis都是存在的，
    //都可以从它拿到顶层对象，指向全局环境下的this。
    ```