'use strict';

const Validate = require('./validate');

/**
 * 生成校验函数
 * @param {boolean} isReturn 默认为 true
 * 传入 true 或者不传，返回的校验函数会将校验失败的提示信息以 return 形式返回
 * 传入 false 时，返回的校验函数会将校验失败的提示信息以 error 形式抛出
 */
const getValidFn = (isReturn = true) => {
  /**
   * 校验函数
   *
   * @param  { object } rulesObj 规则对象，要校验的字段名称及其校验规则，必传
   * @param  { object } paramsObj 校验对象，要校验的对象，必传
   */
  return (rulesObj = {}, paramsObj = {}) => {

    const va = new Validate();

    /**
     * 根据规则对象的 key 值获取校验对象对应 key 的 value 值，并将 key 作为第三个参数传入（校验失败时方便定位失败字段）
     */
    Object.keys(rulesObj).forEach(key => {
      va.add(paramsObj[key], rulesObj[key], key);
    });

    /**
     * 校验结果，若有返回值，代表校验不通过
     * 可选择 return 或者 throw 该值
     */
    const vaResult = va.start();

    if (vaResult) {
      /**
       * 如果使用的是 valid 方法，返回错误信息
       */
      if (isReturn) {
        return vaResult;
      }

      /**
       * 如果使用的是 validTc 方法，抛出一个错误
       */
      throw new Error(vaResult);
    }
  }
}

exports.valid = getValidFn()

exports.validTc = getValidFn(false)


/**
 * 添加自定义校验规则
 *
 * @param { string } ruleName 规则名称，必传
 * @param { function } validFn 该规则对应的校验方法，必传
 * @param { string } failMsg 该规则校验失败返回的错误信息，非必传
 */
exports.addValidRule = (ruleName = '', validFn = () => {}, failMsg = '') => {
  if (!ruleName) return '缺少规则名称';

  return Validate.addValidRule(ruleName, validFn, failMsg);
}
