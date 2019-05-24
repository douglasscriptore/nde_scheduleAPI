'use strict'

const Antl = use('Antl')
const { rule } = use('Validator')

class store {
  get rules () {
    return {
      // validation rules
      title: 'required',
      location: 'required',
      event_date: [rule('required'), rule('date_format', 'YYYY-MM-DD HH:mm:ss')]
    }
  }
  get messages () {
    return Antl.list('validation')
  }
}

module.exports = store
