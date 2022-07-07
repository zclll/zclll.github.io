---
title: javascript - 基础(equal)
categories: javascript基础
tags:
  - javascript
date: 2022-04-02
cover: /image/cover/javascript.jpg
---

### 相等的四种算法

1. 抽象（非严格）相等比较 (==)
2. 严格相等比较 (===)
3. 同值零
4. 同值: 用于所有其他地方

### JavaScript提供三种不同的值比较操作

1. 严格相等比较 (也被称作"strict equality", "identity", "triple equals")，使用 === ,
2. 抽象相等比较 ("loose equality"，"double equals") ，使用 ==
3. 以及 Object.is （ECMAScript 2015/ ES6 新特性）

#### 严格相等

全等操作符比较两个值是否相等，两个被比较的值在比较前都不进行隐式转换。如果两个被比较的值具有不同的类型，这两个值是不全等的。否则，如果两个被比较的值类型相同，值也相同，并且都不是 number 类型时，两个值全等。最后，如果两个值都是 number 类型，当两个都不是 NaN，并且数值相同，或是两个值分别为 +0 和 -0 时，两个值被认为是全等的。如果值为NaN则不相等。

```javascript
var num = 0;
var obj = new String("0");
var str = "0";
var b = false;

console.log(num === num); // true
console.log(obj === obj); // true
console.log(str === str); // true

console.log(num === obj); // false
console.log(num === str); // false
console.log(obj === str); // false
console.log(null === undefined); // false
console.log(obj === null); // false
console.log(obj === undefined); // false
```

### 非严格相等 ==

相等操作符比较两个值是否相等，在比较前将两个被比较的值转换为相同类型。在转换后（等式的一边或两边都可能被转换），最终的比较方式等同于全等操作符 === 的比较方式。 相等操作符满足交换律。

![非严格相等判定](/image/equal/equal.jpg "非严格相等判定")

ToNumber(A) 尝试在比较前将参数 A 转换为数字，这与 +A（单目运算符+）的效果相同。ToPrimitive(A)通过尝试调用 A 的A.toString() 和 A.valueOf() 方法，将参数 A 转换为原始值（Primitive）。

```javascript
var num = 0;
var obj = new String("0");
var str = "0";
var b = false;

console.log(num == num); // true
console.log(obj == obj); // true
console.log(str == str); // true

console.log(num == obj); // true
console.log(num == str); // true
console.log(obj == str); // true
console.log(null == undefined); // true

// both false, except in rare cases
console.log(obj == null);
console.log(obj == undefined);
```

#### 相等比较的模型

![相等比较的区别](/image/equal/equal.png "相等比较的区别")

#### Object.is重写

1. 利用 Object.is (同值相等) 与严格相等(零值相等)的区别
    - `Object.is(NaN, NaN)`的值为**true**
    - `Object.is(+0, -0)`的值为**false**
    - 全等时`NaN === NaN`的值为**false**
    - 全等时`+0 === -0`的值**true**

2. 利用 `1 / +0 === Infinity` 并且 `1 / -0 === -Infinity` 所以 `1 / +0 !== 1 / -0`;
3. 只有 `NaN` 不等于自身,判断值是不是 `NaN`
4. 代码实现

    ```javascript
    Object.myIs = function (a, b) {
      if(a === b) {
        return a !== 0 || 1 / a === 1 / b
      }

      return a !== a && b !== b
    }
    ```
