'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Schedule extends Model {
  static get dates () {
    return super.dates.concat(['event_date'])
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}
module.exports = Schedule
