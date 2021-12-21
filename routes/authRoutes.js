const { register, login, logout } = require('../controller/authcontroller')
const authRouter = require('express').Router()

authRouter.route('/register').post(register)
authRouter.route('/login').post(login)
authRouter.route('/logout').get(logout)

module.exports = authRouter