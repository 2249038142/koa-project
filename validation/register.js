const Validator = require("validator")
const isEmpty = require('./is-empty')
module.exports = function validatorRegisterInput(data) {
    let errors = {}
        //console.log(data)
    if (!Validator.isLength(data.name, { min: 2, max: 20 })) {
        errors.name = '名字长度不能超过30位不小于2位'
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = '邮箱不合法'
    }
    if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
        errors.password = '密码长度不能超过20位不小于6位'
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = '两次密码不一致'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}