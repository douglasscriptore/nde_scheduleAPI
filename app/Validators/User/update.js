'use strict'

class update {
  get rules () {
    return {
      // validation rules
      name: 'required',
      password: 'required',
      new_password: 'required|confirmed'
    }
  }
}

module.exports = update
