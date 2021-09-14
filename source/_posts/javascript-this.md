---
title: javascript - 基础(this指向)
categories: javascript基础
tags:
  - javascript
date: 2018-07-01
cover: /image/cover/javascript.jpg
---

### js 的默认 this 指向

在浏览器中非严格模式 this 默认指向 `window` 或者 `self` 或者 `frames` 或者 `globalThis`

```javascript
window === self === frames === globalThis;
```

在 nodejs 中非严格模式 this 默认指向 `global` 或者 `globalThis`

```javascript
global === globalThis;
```

### 全局上下文

无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象。

```javascript
// 在浏览器中, window 对象同时也是全局对象：
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b); // "MDN"
console.log(b); // "MDN"
```

```javascript
"use strict";

this.d = "MDN";
console.log(window.d); // "MDN"
console.log(d); // "MDN"

c = 37; // 会报错 Uncaught ReferenceError: c is not defined
```

>特别案例：类里面的方法会默认开启严格模式

### JavaScript 的 this 原理

#### 1、问题的由来

学懂 JavaScript 语言，一个标志就是理解下面两种写法，可能有不一样的结果。

   ```javascript
   var obj = {
       foo: function () {},
    };

   var foo = obj.foo;

   // 写法一
   obj.foo();

   // 写法二
   foo();
   ```

上面代码中，虽然 obj.foo 和 foo 指向同一个函数，但是执行结果可能不一样。请看下面的例子。

   ```javascript
   var obj = {
        foo: function () {
            console.log(this.bar);
        },
        bar: 1,
    };

   var foo = obj.foo;
   var bar = 2;

   obj.foo(); // 1
   foo(); // 2
   ```

#### 2、内存的数据结构

JavaScript 语言之所以有this的设计，跟内存里面的数据结构有关系。

```javascript
var obj = { foo:  5 };
```

上面的代码将一个对象赋值给变量obj。JavaScript 引擎会先在内存里面，生成一个对象{ foo: 5 }，然后把这个对象的内存地址赋值给变量obj。

![这是内存的图片](/image/md-image/内存.png "内存分配的图片")
也就是说，变量obj是一个地址（reference）。后面如果要读取obj.foo，引擎先从obj拿到内存地址，然后再从该地址读出原始的对象，返回它的foo属性。

原始的对象以字典结构保存，每一个属性名都对应一个属性描述对象。举例来说，上面例子的foo属性，实际上是以下面的形式保存的。
![这是内存的图片](/image/md-image/obj内存.png "内存分配的图片")

```javascript
{
  foo: {
    [[value]]: 5
    [[writable]]: true
    [[enumerable]]: true
    [[configurable]]: true
  }
}
```

注意，foo属性的值保存在属性描述对象的value属性里面。

#### 3、函数

这样的结构是很清晰的，问题在于属性的值可能是一个函数。

```javascript
var obj = { foo: function () {} };
```

这时，引擎会将函数单独保存在内存中，然后再将函数的地址赋值给foo属性的value属性。
![这是内存的图片](/image/md-image/func内存.png "内存分配的图片")

```javascript
{
  foo: {
    [[value]]: 函数的地址
    ...
  }
}
```

由于函数是一个单独的值，所以它可以在不同的环境（上下文）执行。

```javascript
var f = function () {};
var obj = { f: f };

// 单独执行
f()

// obj 环境执行
obj.f()
```

#### 4、环境变量

JavaScript 允许在函数体内部，引用当前环境的其他变量。

```javascript
var f = function () {
  console.log(x);
};
```

上面代码中，函数体里面使用了变量`x`。该变量由运行环境提供。

现在问题就来了，由于函数可以在不同的运行环境执行，所以需要有一种机制，能够在函数体内部获得当前的运行环境（context）。所以，`this`就出现了，它的设计目的就是在函数体内部，指代函数当前的运行环境。

```javascript
var f = function () {
  console.log(this.x);
}
```

上面代码中，函数体里面的`this.x`就是指当前运行环境的`x`。

```javascript
var f = function () {
  console.log(this.x);
}

var x = 1;
var obj = {
  f: f,
  x: 2,
};

// 单独执行
f() // 1

// obj 环境执行
obj.f() // 2
```

上面代码中，函数f在全局环境执行，`this.x`指向全局环境的`x`。

![函数调用](/image/md-image/func1.png "函数调用内存指向")
在obj环境执行，`this.x`指向`obj.x`。

![函数调用](/image/md-image/func2.png "函数调用内存指向")
回到本文开头提出的问题，obj.foo()是通过obj找到foo，所以就是在obj环境执行。一旦var foo = obj.foo，变量foo就直接指向函数本身，所以foo()就变成在全局环境执行。

#### 改变this指向的方法

1. function.call(thisArg, arg1, arg2, ...)
    - thisArg: 可选的。在 function 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
    - arg1, arg2, ...: 指定的参数列表

2. function.apply(thisArg, [argsArray])
    - this.arg: 可选的。在 function 函数运行时使用的 this 值。请注意，this可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
    - argsArray: 可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。如果该参数的值为 null 或  undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。
3. function.bind(thisArg,arg1, arg2, ...)
    - thisArg: 调用绑定函数时作为 this 参数传递给目标函数的值。 如果使用new运算符构造绑定函数，则忽略该值。当使用 bind 在 setTimeout 中创建一个函数
      （作为回调提供）时，作为 thisArg 传递的任何原始值都将转换为 object。如果 bind 函数的参数列表为空，或者thisArg是null或undefined，执行作用域的 this 将被视为新函数的 thisArg
    - arg1, arg2, ...: 当目标函数被调用时，被预置入绑定函数的参数列表中的参数。
    - bind的多次绑定只有第一次是有效的且不会执行函数

### 总结

1. this 的指向 是在执行上下文时才确定的, 并且确定后不可更改；
2. this 指向 **其执行上下文的环境对象**;
3. this简单判断依据（**谁调用则this指向谁**）
4. **严格**模式下全局调用函数this不默认指向window而是undefined
5. **类**中定义的方法中默认会开启严格模式
