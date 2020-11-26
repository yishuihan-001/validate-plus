# validate-plus

简单、易用、可扩展的参数校验工具

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/validate-plus.svg?style=flat-square
[npm-url]: https://npmjs.org/package/validate-plus
[travis-image]: https://img.shields.io/travis/eggjs/validate-plus.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/validate-plus
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/validate-plus.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/validate-plus?branch=master
[david-image]: https://img.shields.io/david/eggjs/validate-plus.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/validate-plus
[snyk-image]: https://snyk.io/test/npm/validate-plus/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/validate-plus
[download-image]: https://img.shields.io/npm/dm/validate-plus.svg?style=flat-square
[download-url]: https://npmjs.org/package/validate-plus



## 安装

```js
npm i validate-plus -S
```

&nbsp;


## 如何使用

```js
const { valid, validTc, addValidRule } = require('validate-plus')
```

`validate-plus` 提供了三个方法 `valid`, `validTc`, `addValidRule`

1. `valid` 和 `validTc` 方法用于校验数据，区别在于如果校验失败，`valid` 方法会返回失败提示信息，`validTc` 方法会将失败的提示信息包装成 error 抛出；除此之外，`valid` 和 `validTc` 方法无任何区别，两个方法接收的参数都完全相同

2. `addValidRule` 用于添加自定义校验规则，详见 **添加自定义规则**

### valid 方法使用

校验失败时， `valid` 方法会直接返回校验失败的提示信息，你需要用一个变量接收他，根据是否有返回值判断校验是否通过

  ```js
  const obj = { name: 'Slient' }

  const validResultMsg = valid({
    name: [ 'required', 'type:string' ]
  }, obj);

  if (validResultMsg) {
    return this.$message.error(validResultMsg)
  }
  ```

### validTc 方法使用

校验失败时会抛错一个错误，错误信息就是校验失败的提示信息，你需要通过 try.catch 捕获这个错误

  ```js
  const obj = { name: 'Slient' }

  try {
    valid({
      name: [ 'required', 'type:string' ]
    }, obj);
  } catch (err) {
    return this.$message.error(err.message)
  }
  ```

&nbsp;

## valid & validTc 校验方法说明

由于 valid 和 validTc 方法入参（接收两个参数）完全一样，以下均已 valid 方法为例演示用法（省略了try.catch 语句）
### 参数说明

* 第一个参数：下称 **规则对象** （必传）

  规则对象由要校验的字段名称和需要用到的规则数组（对同一字段可进行多种校验）组成

* 第二个参数：下称 **校验对象** （必传）

  校验对象是要校验的数据，会根据规则对象中的字段进行匹配校验，如规则对象添加了对 a、b 字段的校验，而校验对象中含有 a、b、d 字段，那么 d 字段不会被校验

  **即只会对规则对象中指定的字段进行校验**

### 使用说明

1. 只传入规则名，使用默认的失败提示文案

    ```js
    const obj = { name: 'Slient' }

    valid({
      name: [ 'required', 'type:string' ]
    }, obj);
    ```

2. 传入规则名并指定失败提示文案

    ```js
    const obj = { name: 'Slient' }

    valid({
      name: [ { rule: 'required', msg: '缺少名称' }, { rule: 'type:string', msg: '名称需要是字符串类型' } ]
    }, obj);

    //可组合使用
    valid({
      name: [ 'required', { rule: 'type:string', msg: '名称需要是字符串类型' } ]
    }, obj);
    ```

3. 冒号表达式

    也许你已经发现了，有些规则名中存在冒号

    是的，这里我们规定，冒号前面的是规则名，后面的是校验目标，协助我们对传入的值进行校验

    我们的一些校验规则是需要用到冒号表达式的，具体请看**内置规则**，这里以枚举 enum 和相等 equal 为例演示用法

    ```js
    const obj = { role: 2, score: 99 }

    // enum 是枚举规则名，冒号后面是序列常量
    // equal 是相等（全等）规则名，冒号后面是参照目标
    valid({
      role: [ 'required', { rule: 'enum:[3,6,9]', msg: 'role 要是 3、6、9 其中之一' }],
      score: [ 'required', 'type:number', { rule: 'equal:100', msg: '你的分数不等于 100' }]
    }, obj);
    ```

&nbsp;

## 内置规则

我们内置了 10 种校验规则，基本能满足一般校验场景，如需自定义规则，参见**添加自定义规则**

| 规则名 | 释义 | 使用案例 |
| --- | --- | --- |
| required | 校验非空 | valid({ name: [ 'required' ] }, { name: 'Slient' });
| regexpPhone | 校验手机号 | valid({ phone: [ 'regexpPhone' ] }, { phone: 15088888888 });
| regexpEmail | 校验邮箱 | valid({ email: [ 'regexpEmail' ] }, { email: '163.com' });
| minLength | 校验最小长度 | valid({ password: [ 'minLength:8' ] }, { password: '123aaa' });
| maxLength | 校验最大长度 | valid({ password: [ 'maxLength:10' ] }, { password: '123aaa' });
| enum | 校验值是否匹配其一 | valid({ role: [ 'enum:[3,6,9]' ] }, { role: 3 });
| equal | 校验值是否相等 | valid({ score: [ 'equal:100' ] }, { score: 99 });
| type | 校验是否是目标类型 | valid({ age: [ 'type:number' ] }, { age: '十八' });
| min | 校验最小值 | valid({ age: [ 'min:1' ] }, { age: 0 });
| max | 校验最大值 | valid({ age: [ 'max:1000' ] }, { age: 1001 })


&nbsp;

## 添加自定义规则

如果内置规则不能满足需求，我们也可以添加自定义规则，包提供了扩展校验规则的能力，你只需要调用 `addValidRule` 方法就能很容易的添加一条自定义规则

`addValidRule` 方法接受三个参数
* 第一个参数是规则名称（必传）
* 第二个参数是校验函数（必传）
* 第三个参数是校验失败的默认提示信息（非必传）

### 添加普通规则

普通规则的校验函数接收两个参数，参 1 是需要校验的值，参 2 是校验失败的提示信息

```js
// 判断密码是否符合规则（数字字母混合且不小于 6 位字符）

addValidRule('mixNumLetter', (val, msg) => {
  if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(val)) {
    return msg;
  }
}, '该字段正则校验不通过')

const obj = { password: 'abc' }

valid({
  password: [ 'required', { rule: 'mixNumLetter', msg: '请输入不小于 6 位的数字字母混合密码' }]
}, obj);
```

### 添加冒号表达式规则

冒号表达式规则的校验函数接收三个参数，参 1 是需要校验的值，参 2 是校验目标，参 3 是校验失败的提示信息

```js
// 判断输入的字符知否以指定字符开头

addValidRule('startWith', (val, target, msg) => {
  if (val.slice(0, target.length) !== target) {
    return msg;
  }
}, '该字段正则校验不通过')

const obj = { password: 'abdeee' }

valid({
  password: [ 'required', { rule: 'startWith:abc', msg: '请输入以 abc 开始的字符' }]
}, obj);
```

&nbsp;

## 完整案例

```js
const { valid, validTc, addValidRule } = require('validate-plus')

export default {
  methods: {
    createUser () {
      const obj = { name: 'slient', age: 9, role: 9, password: '12345' }

      addValidRule('mixNumLetter', (val, msg) => {
        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(val)) {
          return msg;
        }
      }, '密码格式不正确')

      const validResult = valid({
        name: [ 'required', 'type:string' ],
        age: [ 'required', 'type:number', { rule: 'min:8', msg: 'age 要大于 8' }],
        role: [ 'required', { rule: 'enum:[3,6,9]', msg: 'role 要是 3、6、9 其一' }],
        password: [ 'required', { rule: 'mixNumLetter' }],
      }, obj)

      if (validResult) {
        return this.$message.error(validResult)
      }

      // ...
    }
  }
}
```

&nbsp;

## 如何在 egg 应用中使用这个包

针对 egg 应用，或许你可以了解一下 **egg-validate-plugin**

`egg-validate-plugin` 是当前校验包针对 egg 应用的插件版，如果你已了解 `validate-plus`，那么只需 3 分钟即可上手 `egg-validate-plugin`，了解更多请走传送门 [egg-validate-plugin](https://www.npmjs.com/package/egg-validate-plugin)


&nbsp;

## 提问交流

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。


&nbsp;
## License

[MIT](LICENSE)
