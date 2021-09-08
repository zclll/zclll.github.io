---
title: python 基础库
categories: python 学习
tags: 
    - python
cover: image/cover/python.png
---

### json

1. 引入json库

    ```python
    import json
    ```

2. json方法
    - json.dumps
    将 Python 对象编码成 JSON 字符串（返回转换后的json字符串）

    ```python
    json.dumps(obj, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, cls=None, indent=None, separators=None, encoding="utf-8", default=None, sort_keys=False, **kw)
    # obj - 需要修改的 Python 对象
    # skipkeys - 默认值是 False，如果dict的keys内的数据不是python的基本类型(str,unicode,int,long,float,bool,None)，设置为False时，就会报TypeError的错误。此时设置成True，则会跳过这类key 。
    # ensure_ascii - 默认输出ASCLL码，如果把这个该成False,就可以输出中文。
    # check_circular - 如果check_circular为 False ，则跳过对容器类型的循环引用检查，循环引用将导致溢出错误(或更糟的情况)。
    # allow_nan - 如果allow_nan为假，则ValueError将序列化超出范围的浮点值(nan、inf、-inf)，严格遵守JSON规范，而不是使用JavaScript等价值(nan、Infinity、-Infinity)。
    # indent - 参数根据数据格式缩进显示，读起来更加清晰。
    # separators - 是分隔符的意思，参数意思分别为不同dict项之间的分隔符和dict项内key和value之间的分隔符，把：和，后面的空格都除去了。
    # sort_keys - True是告诉编码器按照字典排序(a到z)输出。如果是字典类型的python对象，就把关键字按照字典排序。
    ```

    - json.dump
    把python对象转换成json对象生成一个fp的文件流，和文件相关。python对象转换为字符串并且写入文件

    ```python
    import json
    #将python对象转换为json字符串
    persons = [
        {
            'username': "zhaoji",
            "age": "18",
            "country": "China"
        },
        {
            "username": "cyj",
            "age": "18",
            "country": "China"
        }
    ]
    with open("./data/j1.json", "w") as fp:
        json.dump(persons, fp) // 将person存成文件
    ```

    - json.loads是用来读取字符串,可以把文件打开，用readline()读取一行，然后json.loads()一行。
    - json.load是用来读取文件的，即，将文件打开然后就可以直接读取。
