const CustomError = require('../errors')
// const jwt = require('jsonwebtoken')
const { isTokenValid } = require('../utils/jwt')

//need token to access
const authenticateuser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
    try {
        const { name, userID, role } = isTokenValid({ token })
        req.user = { name, userID, role }
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }

}
//Meron to sa userroutes
const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorize to access this route')
        }
        next()
    }

}

module.exports = { authenticateuser, authorizePermission }