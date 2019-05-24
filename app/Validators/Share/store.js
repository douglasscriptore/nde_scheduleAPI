'use strict'

const Antl = use('Antl')

class store {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      // validation rules
      email: 'required|email'
    }
  }
  get messages () {
    return Antl.list('validation')
  }
}

module.exports = store
