const jwt = require('jsonwebtoken')

const createJWT = ({payload})=>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME})
return token
}

const isTokenValid = ({token})=>{
    jwt.verify(token, process.env.JWT_SECRET)
}

const attachcokie = ({res, user}) =>{
    const token = createJWT({payload:user})
    const oneday = 1000*60*60*24
    res.cookie('token', token, {expire:new Date(Date.now()+ oneday), httpOnly:true})
//ito and i attached sa authuser
// attachcookie({res, user:Tokenuser})
}

module.exports = {createJWT, isTokenValid}