---
title: javascript - 随手摘要(string)
categories: javascript基础
tags:
    - javascript
date: 2020-11-25
cover: /image/cover/javascript.jpg
---

1. **标签模板** ：模板字符串的特殊功能，它可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。这被称为“**标签模板**”功能（tagged template）。**标签模板**其实不是模板，而是函数调用的一种特殊形式。

    ```javascript
    let a = 5;
    let b = 10;

    function tag() {}

    tag`Hello ${ a + b } world ${ a * b }`;
    // 等同于
    tag(['Hello ', ' world ', ''], a + b, a * b);
    ```

2. **String.fromCodePoint()** : 用于从 Unicode 码点返回对应字符;
    - 方法主要是对ES5  `String.fromCharCode()` 补充
    - ES5 `String.fromCharCode()` 不能识别码点大于0xFFFF的字符。
    - ES6 `String.fromCodePoint()` 可以识别大于0xFFFF的字符
    - 在作用上 与 `codePointAt()` 方法相反。

3. **String.raw()** : 该方法返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，往往用于模板字符串的处理方法。

    ```javascript
    // 例子
    String.raw`Hi\n${2+3}!` // "Hi\\n5!"
    // 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"

    // 特殊的标签模板
    ```

4. **codePointAt()** ： 返回一个字符的码点 (实例方法)。
    - JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符。***ES6*** 提供了`codePointAt()`方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。

    ```javascript
    var s = "𠮷";

    s.length // 2
    s.charAt(0) // ''
    s.charAt(1) // ''
    s.charCodeAt(0) // 55362
    s.charCodeAt(1) // 57271

    // 汉字“𠮷”（注意，这个字不是“吉祥”的“吉”）的码点是0x20BB7，UTF-16 
    // 编码为0xD842 0xDFB7（十进制为55362 57271），需要4个字节储存。
    // 对于这种4个字节的字符，JavaScript 不能正确处理，字符串长度会误判为2，
    // 而且charAt()方法无法读取整个字符，
    // charCodeAt()方法只能分别返回前两个字节和后两个字节的值。
    ```

    - `codePointAt()` 方法的参数，是字符在字符串中的位置（默认从 0 开始）。方法返回的是码点的十进制值，如果想要十六进制的值，可以使用toString()方法转换一下。

    ```javascript
    let s = '𠮷a';

    s.codePointAt(0).toString(16) // "20bb7"
    s.codePointAt(2).toString(16) // "61"

    // 字符a在字符串s的正确位置序号应该是 1，
    // 但是必须向codePointAt()方法传入 2。

    // 解决方案1
    let s = '𠮷a';
    for (let ch of s) {
    console.log(ch.codePointAt(0).toString(16));
    }
    // 20bb7
    // 61

    // 解决方案2
    let arr = [...'𠮷a']; // arr.length === 2
    arr.forEach(
    ch => console.log(ch.codePointAt(0).toString(16))
    );
    // 20bb7
    // 61
    ```

    - codePointAt()方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。

    ```javascript
    function is32Bit(c) {
    return c.codePointAt(0) > 0xFFFF;
    }

    is32Bit("𠮷") // true
    is32Bit("a") // false
    ```

5. **normalize()** ：用来将字符的不同表示方法统一为同样的形式，这称为 Unicode 正规化。

    ```javascript
    '\u01D1'==='\u004F\u030C' 
    //false
    '\u01D1'.normalize() === '\u004F\u030C'.normalize()
    // true

    // normalize方法可以接受一个参数来指定normalize的方式，参数的四个可选值如下。
        // NFC，默认参数，表示“标准等价合成”（Normalization Form Canonical Composition），返回多个简单字符的合成字符。所谓“标准等价”指的是视觉和语义上的等价。
        // NFD，表示“标准等价分解”（Normalization Form Canonical Decomposition），即在标准等价的前提下，返回合成字符分解的多个简单字符。
        // NFKC，表示“兼容等价合成”（Normalization Form Compatibility Composition），返回合成字符。所谓“兼容等价”指的是语义上存在等价，但视觉上不等价，比如“囍”和“喜喜”。（这只是用来举例，normalize方法不能识别中文。）
        // NFKD，表示“兼容等价分解”（Normalization Form Compatibility Decomposition），即在兼容等价的前提下，返回合成字符分解的多个简单字符。

    // normalize方法目前不能识别三个或三个以上字符的合成。
    // 这种情况下，还是只能使用正则表达式，通过 Unicode 编号区间判断。
    ```

6. **includes()** ：返回布尔值，表示是否找到了参数字符串。(实例方法)
    - 参数1: 需要找的字符串
    - 参数2: 表示开始搜索的位置。包括当前位置

    ```javascript
    let s = 'Hello world!';
    s.includes('o') // true
    s.includes('o', 8) // false
    ```

7. **startsWith()** ：返回布尔值，表示参数字符串是否在原字符串的头部。(实例方法)
    - 参数1: 需要找的字符串
    - 参数2: 表示开始搜索的位置。包括当前位置

    ```javascript
    let s = 'Hello world!';
    s.startsWith('Hello') // true
    s.startsWith('world', 6) // true
    ```

8. **endsWith()** ：返回布尔值，表示参数字符串是否在原字符串的尾部。(实例方法)
    - 参数1: 需要找的字符串
    - 参数2: 表示最后的位置。不包括当前位置

    ```javascript
    let s = 'Hello world!';
    s.endsWith('!') // true
    s.endsWith('Hello', 5) // true
    s.endsWith('Hello', 4) // false
    ```

9. **repeat()** ：返回一个新字符串，表示将原字符串重复n次。(实例方法)

    ```javascript
    'x'.repeat(3) // "xxx"
    'hello'.repeat(2) // "hellohello"
    'na'.repeat(0) // ""

    // 参数如果是小数，会被取整。
    'na'.repeat(2.9) // "nana"

    // 如果repeat的参数是负数或者Infinity，会报错。
    'na'.repeat(Infinity)
    // RangeError
    'na'.repeat(-1)
    // RangeError

    // 如果参数是 0 到-1 之间的小数，则等同于 0，这是因为会先进行取整运算。
    // 0 到-1 之间的小数，取整以后等于-0，repeat视同为 0。
    'na'.repeat(-0.9) // ""

    // 参数NaN等同于 0。
    'na'.repeat(NaN) // ""

    // 如果repeat的参数是字符串，则会先转换成数字。
    'na'.repeat('na') // ""
    'na'.repeat('3') // "nanana"
    ```

10. **padStart()**，**padEnd()** ： 返回一个新字符串，padStart()用于头部补全，padEnd()用于尾部补全。(实例方法)
    - 参数1: 字符串补全生效的最大长度
    - 参数2: 用来补全的字符串

    ```javascript
    'x'.padStart(5, 'ab') // 'ababx'
    'x'.padStart(4, 'ab') // 'abax'

    'x'.padEnd(5, 'ab') // 'xabab'
    'x'.padEnd(4, 'ab') // 'xaba'

    // 如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。
    'xxx'.padStart(2, 'ab') // 'xxx'
    'xxx'.padEnd(2, 'ab') // 'xxx'

    // 如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，
    // 则会截去超出位数的补全字符串。
    'abc'.padStart(10, '0123456789')
    // '0123456abc'

    // 如果省略第二个参数，默认使用空格补全长度。
    'x'.padStart(4) // '   x'
    'x'.padEnd(4) // 'x   '

    ```

11. **trimStart()**，**trimEnd()** ： 返回的都是新字符串，trimStart()消除字符串头部的空格，trimEnd()消除尾部的空格。(实例方法)

    ```javascript
    const s = '  abc  ';

    s.trim() // "abc"
    s.trimStart() // "abc  "
    s.trimEnd() // "  abc"

    // 除了空格键，这两个方法对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。
    // 浏览器还部署了额外的两个方法，trimLeft()是trimStart()的别名，trimRight()是trimEnd()的别名。
    ```

12. **matchAll()** ： 返回一个正则表达式在当前字符串的所有匹配(实例方法)

13. **replaceAll()** ： 返回一个新字符串，不会改变原字符串。可以一次性替换所有匹配。(实例方法)
    - 参数1 ： 可以是一个字符串，也可以是一个全局的正则表达式（**带有g修饰符**）。

    ```javascript
    // 不报错
    'aabbcc'.replace(/b/, '_')

    // 报错
    'aabbcc'.replaceAll(/b/, '_')
    ```

    - 参数2: 可以是字符串也可以是函数
        1. 是一个字符串，表示替换的文本，其中可以使用一些特殊字符串。
            - `$&`：匹配的字符串。
            - `$ˋ`：匹配结果前面的文本。
            - `$'`：匹配结果后面的文本。
            - `$n`：匹配成功的第n组内容，n是从1开始的自然数。这个参数生效的前提是，第一个参数必须是正则表达式。
            - `$$`：指代美元符号$。

        2. 是一个函数，该函数的返回值将替换掉第一个参数searchValue匹配的文本。

    ```javascript
    // $& 表示匹配的字符串，即`b`本身
    // 所以返回结果与原字符串一致
    'abbc'.replaceAll('b', '$&')
    // 'abbc'

    // $` 表示匹配结果之前的字符串
    // 对于第一个`b`，$` 指代`a`
    // 对于第二个`b`，$` 指代`ab`
    'abbc'.replaceAll('b', '$`')
    // 'aaabc'

    // $' 表示匹配结果之后的字符串
    // 对于第一个`b`，$' 指代`bc`
    // 对于第二个`b`，$' 指代`c`
    'abbc'.replaceAll('b', `$'`)
    // 'abccc'

    // $1 表示正则表达式的第一个组匹配，指代`ab`
    // $2 表示正则表达式的第二个组匹配，指代`bc`
    'abbc'.replaceAll(/(ab)(bc)/g, '$2$1')
    // 'bcab'

    // $$ 指代 $
    'abc'.replaceAll('b', '$$')
    // 'a$c'
    ```

    - 和 **replace()** 区别

    ```javascript
    replaceAll()
    'aabbcc'.replaceAll('b', '_')
    // 'aa__cc'

    replace()
    // replace()只将第一个b替换成了下划线。
    'aabbcc'.replace('b', '_')
    // 'aa_bcc'
    // 如果要替换所有的匹配，不得不使用正则表达式的g修饰符。
    'aabbcc'.replace(/b/g, '_')
    // 'aa__cc'
    ```

14. **at()** ：方法接受一个整数作为参数，返回参数指定位置的字符，支持负索引（即倒数的位置）。(实例方法)

    ```javascript
    const str = 'hello';
    str.at(1) // "e"
    str.at(-1) // "o"

    // 如果参数位置超出了字符串范围，at()返回undefined。
    str.at(5) // undefined
    ```
