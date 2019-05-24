'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['name', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ request, response, auth }) {
    const data = request.only(['name', 'password', 'new_password'])
    const authUser = auth.user

    // verify password
    const verifyPassowrd = await Hash.verify(data.password, authUser.password)

    if (!verifyPassowrd) {
      response.status(403).send({
        message: 'The password is invalid',
        field: 'password',
        validation: 'invalid'
      })
    }

    authUser.password = data.new_password
    authUser.save()
    return authUser
  }
}

module.exports = UserController
