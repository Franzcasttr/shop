const createTokeUser = (user)=>{
 return {name: user.name, userID:user._id, role:user.role}
}

module.exports = createTokeUser