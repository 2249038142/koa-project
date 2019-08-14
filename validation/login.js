const Validator = require("validator")
const isEmpty = require('./is-empty')
module.exports = function validatorLoginInput(data) {
    let errors = {}
        //console.log(data)

    if (!Validator.isEmail(data.email)) {
        errors.email = '邮箱不合法'
    }
    if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
        errors.password = '密码长度不能超过20位不小于6位'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}