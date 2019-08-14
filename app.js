const Koa = require('koa')
const json = require('koa-json')
const KoaRouter = require('koa-router')
const path = require('path')
const render = require('koa-ejs')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const passport = require("koa-passport")
    //实例化
const app = new Koa()
const router = new KoaRouter()

//引入users
const users = require('./router/api/users')

app.use(json())
app.use(bodyParser())

//config
const db = require("./config/keys").mongoURI
    //连接数据库
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('Mongo connected')
    })
    .catch(err => {
        console.log(err)
    })

app.use(passport.initialize())
app.use(passport.session())
    // 回调到config文件中 passport.js
require('./config/passport')(passport)
    //配置路由地址
router.use('/api/users', users)
    //DB
    //const things = [{ name: 'friends' }, { name: 'family' }]
    //配置模板引擎
render(app, {
    //当前路径的views文件夹
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
})

//路由跳转
router.get('/', index)
router.get('/add', showAdd)
    //函数申明
async function index(ctx) {
    await ctx.render('index', {
        title: 'I love node',
        things: things
    })
}

async function showAdd(ctx) {
    await ctx.render('add')
}

router.get('/test', ctx => (ctx.body = 'hello Router!'))
    //配置路由模块
app.use(router.routes()).use(router.allowedMethods())

app.use(async ctx => (ctx.body = { msg: 'Hello world!' }))
app.listen(3000, () => console.log('Server started...'))