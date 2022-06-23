---
title: javascript - 随手摘要(解构赋值)
categories: javascript基础
tags:
    - javascript
date: 2020-11-24
cover: /image/cover/javascript.jpg
---

1. ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）；如果解构不成功，变量的值就等于`undefined`。

2. 如果等号的右边不是数组（或者严格地说，**不是可遍历的结构**），那么将会报错。

    ```javascript
    // 报错
    let [foo] = 1;
    let [foo] = false;
    let [foo] = NaN;
    let [foo] = undefined;
    let [foo] = null;
    let [foo] = {};

    // 对于 Set 结构，也可以使用数组的解构赋值。
    let [x, y, z] = new Set(['a', 'b', 'c']);

    // 事实上，只要某种数据结构具有 Iterator 接口，
    //都可以采用数组形式的解构赋值。
    function* fibs() {
        let a = 0;
        let b = 1;
        while (true) {
            yield a;
            [a, b] = [b, a + b];
        }
    }

    let [first, second, third, fourth, fifth, sixth] = fibs();
    ```

3. 解构赋值允许指定默认值。

    ```javascript
    let [foo = true] = [];
    foo // true

    let [x, y = 'b'] = ['a']; // x='a', y='b'
    let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'

    // 注意，ES6 内部使用严格相等运算符（===），判断一个位置是否有值。
    // 所以，只有当一个数组成员严格等于undefined，默认值才会生效。

    let [x = 1] = [undefined];
    x // 1

    let [x = 1] = [null];
    x // null
    ```

4. 如果默认值是一个表达式，那么这个表达式是**惰性求值**的，即只有在用到的时候，才会求值。

    ```javascript
    function f() {
        console.log('aaa');
    }

    let [x = f()] = [1];

    // 上面代码中，因为x能取到值，所以函数f根本不会执行。
    // 上面的代码其实等价于下面的代码。

    let x;
    if ([1][0] === undefined) {
        x = f();
    } else {
        x = [1][0];
    }

    // 默认值可以引用解构赋值的其他变量，但该变量必须已经声明。

    let [x = 1, y = x] = [];     // x=1; y=1
    let [x = 1, y = x] = [2];    // x=2; y=2
    let [x = 1, y = x] = [1, 2]; // x=1; y=2
    let [x = y, y = 1] = [];     // ReferenceError: y is not defined
    ```

5. 对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。如果解构失败，变量的值等于`undefined`。

    ```javascript
    let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
    foo // "aaa"
    bar // "bbb"

    let { baz } = { foo: 'aaa', bar: 'bbb' };
    baz // undefined
    ```

6. 对象的解构赋值是下面形式的简写,对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。**真正被赋值的是后者**，而不是前者。

    ```javascript
    let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };

    // 对象的解构赋值的内部机制，
    // 是先找到同名属性，
    // 然后再赋给对应的变量。
    // 真正被赋值的是后者，而不是前者。
    let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
    baz // "aaa"
    foo // error: foo is not defined

    // 复杂例子
    let obj = {};
    let arr = [];

    ({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

    obj // {prop:123}
    arr // [true]
    ```

7. 对象解构也可以用于嵌套结构的对象。

    ```javascript
    let obj = {
    p: [
        'Hello',
        { y: 'World' }
    ]
    };

    let { p: [x, { y }] } = obj;
    x // "Hello"
    y // "World"

    // 这时p是--模式--，不是--变量--，
    // 因此不会被赋值。如果p也要作为变量赋值，可以写成下面这样。

    let { p, p: [x, { y }] } = obj;
    ```

8. 对象的解构赋值可以取到继承的属性。

    ```javascript
    const obj1 = {};
    const obj2 = { foo: 'bar' };
    Object.setPrototypeOf(obj1, obj2);

    const { foo } = obj1;
    foo // "bar"
    ```

9. 默认值生效的条件和数组一样，对象的属性值严格等于undefined才生效

    ```javascript
    var {x = 3} = {x: undefined};
    x // 3

    var {x = 3} = {x: null};
    x // null
    ```

10. 注意点⚠️
    - 如果要将一个已经声明的变量用于解构赋值，必须非常小心。

        ```javascript
        // 错误的写法
        let x;
        {x} = {x: 1};
        // SyntaxError: syntax error

        // 因为 JavaScript 引擎会将{x}理解成一个代码块，从而发生语法错误。
        // 只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。
        // 正确的写法
        let x;
        ({x} = {x: 1});
        ```

    - 解构赋值允许等号左边的模式之中，不放置任何变量名。因此，可以写出非常古怪的赋值表达式。

        ```javascript
        ({} = [true, false]);
        ({} = 'abc');
        ({} = []);
        // 上面的表达式虽然毫无意义，但是语法是合法的，可以执行。
        ```

    - 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。

        ```javascript
        let arr = [1, 2, 3];
        let {0 : first, [arr.length - 1] : last} = arr;
        first // 1
        last // 3
        ```

11. 字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象

    ```javascript
    const [a, b, c, d, e] = 'hello';
    a // "h"
    b // "e"
    c // "l"
    d // "l"
    e // "o"

    // 类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。

    let {length : len} = 'hello';
    len // 5
    ```

12. 数值和布尔值的解构赋值

    ```javascript
    // 解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。

    let {toString: s} = 123;
    s === Number.prototype.toString // true

    let {toString: s} = true;
    s === Boolean.prototype.toString // true

    // 解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。
    // 由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

    let { prop: x } = undefined; // TypeError
    let { prop: y } = null; // TypeError
    ```

13. 圆括号问题
    - 不能使用圆括号的情况

        ```javascript
        // （1）变量声明语句
        // 全部报错
        let [(a)] = [1];

        let {x: (c)} = {};
        let ({x: c}) = {};
        let {(x: c)} = {};
        let {(x): c} = {};

        let { o: ({ p: p }) } = { o: { p: 2 } };

        // (2）函数参数
        // 函数参数也属于变量声明，因此不能带有圆括号。

        // 报错
        function f([(z)]) { return z; }
        // 报错
        function f([z,(x)]) { return x; }

        // (3) 赋值语句的模式

        // 全部报错
        ({ p: a }) = { p: 42 };
        ([a]) = [5];
        ```

    - 可以使用圆括号的情况

        ```javascript
        //赋值语句的非模式部分，可以使用圆括号。
        [(b)] = [3]; // 正确
        ({ p: (d) } = {}); // 正确
        [(parseInt.prop)] = [3]; // 正确
        ```
