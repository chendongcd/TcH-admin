
const config = require('../src/utils/config')

const { apiPrefix } = config

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: EnumRoleType.ADMIN,
  }, {
    id: 1,
    username: 'developer',
    password: 'developer',
    permissions: EnumRoleType.DEVELOPER,
  }, {
    id: 2,
    username: 'guest',
    password: 'guest',
    permissions: EnumRoleType.DEFAULT,
  },
]

module.exports = {
  [`POST ${apiPrefix}/user/login`] (req, res) {
    console.log(req)
    const { username, password } = req.body
    const user = adminUsers.filter(item => item.username === username)
    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      })
      setTimeout(() => {
        res.json({success: true, message: 'Ok', data: user[0], code: 200})
      },1000)
    } else {
      res.status(400).end()
    }
  },

  [`GET ${apiPrefix}/user/logout`] (req, res) {
    res.clearCookie('token')
    res.status(200).end()
  },
}
