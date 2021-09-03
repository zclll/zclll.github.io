---
title: google js 规范
categories: 规范
tags:
  - javascript
excerpt: 代码书写规范
date: 2018-06-03 20:33:36
cover: /image/md-image/javascript.jpg
---


#### 文件规范

- 文件名必须小写但是可以含有（_或者-）但是不能含有其他的符号
- 源文件以 UTF-8 编码
- 制表符不用于缩进
- 对于任何具有特殊转义序列（\'、\"、\\、\b、\f、\n、\r、\t、\v）的字符，将使用该序列而不是相应的数字转义（例如\x0a、\u000a 或 \u{a}）。从不使用传统的八进制转义。
- 对于剩余的非 ASCII 字符，使用实际的 Unicode 字符（例如 ∞）或等效的十六进制或 Unicode 转义符（例如 \u221e），仅取决于哪个使代码更易于阅读和理解。

```javascript
// 最好的方式，即使没有注释也很清晰
const units = 'μs';
// 允许（后面有注释，可以清楚表达意思）：但不必要，因为 μ 是可打印字符。
const units = '\u03bcs'; // 'μs'
// 很好的方式，为了清楚起见，对不可打印的字符使用转义符，并带有注释。
const units = '\ufeff' + content; //content 为不可打印字符，预先添加字节顺序标记。
// 最差的方式，没有注释，读者不知道或者不能清晰的明白这是个什么
const units = '\u03bcs';
// 永远不要因为担心某些程序可能无法正确处理非 ASCII 字符而使代码的可读性降低。
```

#### 导入文件规范

- .js 文件扩展名在导入路径中不是可选的，必须始终包含在内。这样代码更清晰
- 不要多次导入同一个文件。这会使确定文件的总导入变得困难（同一文件下的导入应该统一在一起）
- 仅在要在模块外部使用时才导出。未导出的模块本地符号未声明为 @private，它们的名称也不以下划线结尾。导出和模块本地符号没有规定的顺序。
- 不要使用默认导出。导入模块必须为这些值命名，这会导致模块间命名不一致。也可以达到按需加载

```javascript
// 别使用默认导出
export default class Foo { ... } // 不好的!

// 使用命名导出:
export class Foo { ... } // 推荐

// 替代样式命名导出:
class Foo { ... }

export {Foo}; // 推荐
```
  
- 不要为了命名空间而导出带有静态方法或属性的容器类或对象。

```javascript
// 不好：Container 是一个导出类，只有静态方法和字段。
export class Container {
  /** @return {number} */
  static bar() {
    return 1;
  }
}

/** @const {number} */
Container.FOO = 1;

// 好的方式：直接单独导出需要常量或者函数
/** @return {number} */
export function bar() {
  return 1;
}

export const /** number */ FOO = 1;

```

- 不得在模块初始化之外更改导出的变量。

```javascript
// 不好的: foo 和 mutateFoo 都被导出和变异
export let /** number */ foo = 0;

/**
 * Mutates foo.
 */
export function mutateFoo() {
  ++foo;
}

/**
 * @param {function(number): number} newMutateFoo
 */
export function setMutateFoo(newMutateFoo) {
  // 导出的类和函数可以变异!
  mutateFoo = () => {
    foo = newMutateFoo(foo);
  };
}

----------------------------------------------------
// 好的方法：给foo一个getter函数，给mutateFooFunc一个包装
let /** number */ foo = 0;
let /** function(number): number */ mutateFooFunc = foo => foo + 1;

/** @return {number} */
export function getFoo() {
  return foo;
}

export function mutateFoo() {
  foo = mutateFooFunc(foo);
}

/** @param {function(number): number} mutateFoo */
export function setMutateFoo(mutateFoo) {
  mutateFooFunc = mutateFoo;
}

```

- `export from` 语句不能换行
- 不要在模块中创建循环比如（在a模块中引入b，又在b模块中引入a），即使ECMAScript允许这样的语法
- 一个**没有else**且**语句可以放在一行**的if ，当它提高可读性时，可以保留在没有大括号的一行中。
