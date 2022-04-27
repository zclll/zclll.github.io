---
title: javascript基础知识
categories: javascript基础
tags:
  - javascript

date: 2019-04-05
cover: /image/cover/javascript.jpg
---

## 数据类型和语法

### 数据类型

- 七种基本数据类型
  1. 布尔值(Boolean),有两个值分别为：`true`和`false`
  2. null,一个表明null值的关键字，JavaScript 是大小写敏感的，因此null 与 Null、NULL或变体完全不同。
  3. undefined, 和null一样的特殊关键字，undefined表示变量未赋值时的属性 
  4. 数字（Number），整数或浮点数，例如： 42 或者 3.14159。
  5. 任意精度的整数 (BigInt) ，可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制。
  6. 字符串（String），字符串是一串表示文本值的字符序列，例如："Howdy" 。
  7. 代表（Symbol） ( 在 ECMAScript 6 中新添加的类型).。一种实例是唯一且不可改变的数据类型。
- 对象(Object)

### 数字转换为字符串

1. 在包含的数字和字符串的表达式中使用加法运算符（+），JavaScript 会把数字转换成字符串。

    ```javascript
    x = "The answer is " + 42 // "The answer is 42"
    y = 42 + " is the answer" // "42 is the answer"
    ```

2. 在涉及其它运算符（译注：如下面的减号'-'）时，JavaScript语言不会把数字变为字符串。

    ```javascript
    "37" - 7 // 30
    "37" + 7 // "377"
    ```

3. parseInt 方法只能返回整数，所以使用它会丢失小数部分。另外，调用 parseInt 时最好总是带上进制(radix) 参数，这个参数用于指定使用哪一种进制。将字符串转换为数字的另一种方法是使用一元加法运算符。

    ```javascript
    parseInt("66a") // 66
    parseInt("66", 8) // 54 以8进制66解析为10进制的54
    parseInt("66", 2) // NaN
    (54).toString(8) // 66 10进制的54解析为8进制的66
    "54".toString(8) // 54 字符串则不会进制转换

    // 一元加法运算符字符串转数字
    "1.1" + "1.1" = "1.11.1"
    (+"1.1") + (+"1.1") = 2.2
    // 注意：加入括号为清楚起见，不是必需的。
    ```

## 流程控制与错误处理

### if...else...语句

1. if 条件错误的值（也被叫做Falsy值）
    - false
    - undefined
    - null
    - 0
    - NaN
    - 空字符串（""） 
    ***注意不报括（"   "中间有空格）当传递给条件语句所有其他的值，包括所有对象会被计算为真 。***

2. 请不要混淆原始的布尔值true和false 与 Boolean对象的真和假。例如：

    ```javascript
    var b = new Boolean(false);
    if (b) //结果视为真
    if (b == true) // 结果视为假
    ```

### try...catch...finally... 语句

1. 简介

    如果你在try代码块中的代码如果没有执行成功，那么你希望将执行流程转入catch代码块。如果try代码块中的语句（或者try 代码块中调用的方法）一旦抛出了异常，那么执行流程会立即进入catch 代码块。如果try代码块没有抛出异常，catch代码块就会被跳过。finally 代码块总会紧跟在try和catch代码块之后执行，但会在try和catch代码块之后的其他代码之前执行。

2. catch 块
    可以用这个标识符来获取抛出的异常信息。在插入throw块时JavaScript创建这个标识符；标识符只存在于catch块的存续期间里；当catch块执行完成时，标识符不再可用。

3. finally块
  finally块包含了在try和catch块完成后、下面接着try...catch的语句之前执行的语句。finally块无论是否抛出异常都会执行。如果抛出了一个异常，就算没有异常处理，finally块里的语句也会执行。
