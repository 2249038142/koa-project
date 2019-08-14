const Router = require("koa-router")
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../../config/keys")
const tools = require("../../config/tools")
const passport = require("koa-passport")
const router = new Router()
    //引入User
const User = require("../../models/User")
    //引入验证
const validatorRegisterInput = require("../../validation/register")
const validatorLoginInput = require("../../validation/login")

/**
 * @router get api/users/test
 */
//test
router.get("/test", async ctx => {
    ctx.status = 200
    ctx.body = {
        msg: 'users working...'
    }
})

/**
 * @router POST api/users/register
 */
//test
router.post("/register", async ctx => {

        const { errors, isValid } = validatorRegisterInput(ctx.request.body)
            //判断验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return
        }
        const findEmail = await User.find({ email: ctx.request.body.email })
        if (findEmail.length > 0) {
            ctx.status = 500;
            ctx.body = { email: '邮箱已存在' }
        } else {
            const avatar = gravatar.url(ctx.request.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            const newUser = new User({
                name: ctx.request.body.name,
                email: ctx.request.body.email,
                password: tools.encrypt(ctx.request.body.password),
                avatar
            })

            await newUser.save().then(user => {
                    ctx.body = user
                }).catch(err => {
                    console.log(err)
                })
                // ctx.body = newUser
        }
    })
    /**
     * @router POST api/users/Login
     * 登陆接口，返回token
     */
router.post("/login", async ctx => {
        const { errors, isValid } = validatorLoginInput(ctx.request.body)
            //判断验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return
        }

        const findEmail = await User.find({ email: ctx.request.body.email })
        if (findEmail.length == 0) {
            ctx.status = 404;
            ctx.body = { email: '用户不存在' }
        } else {
            //验证密码
            //console.log(findEmail)
            var result = await bcrypt.compareSync(ctx.request.body.password, findEmail[0].password)
            if (result) {
                const payload = {
                    id: findEmail[0]._id,
                    name: findEmail[0].name,
                    avatar: findEmail[0].avatar,
                }
                const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 })
                ctx.status = 200
                ctx.body = { success: true, token: 'bearer ' + token }
            } else {
                ctx.status = 400
                ctx.body = { password: '用户名或密码错误' }
            }
        }
    })
    /**
     * @router GET api/users/current
     *  用户信息接口，接口私密
     */
router.get("/current", passport.authenticate('jwt', { session: false }), async ctx => {
    async ctx => {
        ctx.body = {
            id: ctx.state.user.id,
            name: ctx.state.user.name,
            email: ctx.state.user.email,
        }
    }

})
module.exports = router.routes()