'use strict'

const moment = require('moment')

const Kue = use('Kue')
const Job = use('App/Jobs/SharedScheduleMail')

const Schedule = use('App/Models/Schedule')

class SheredScheduleController {
  async store ({ request, params, response, auth }) {
    const { email } = request.only(['email'])

    const schedule = await Schedule.findOrFail(params.id)
    if (schedule.user_id !== auth.user.id) {
      return response.status(401).json({
        error: {
          message: 'Você não pode compartilhar um cronograma de outro usuario'
        }
      })
    }

    // verify if date is after today
    const isAfter = moment().isAfter(schedule.event_date)
    if (isAfter) {
      response.status(401).send({
        error: {
          message: 'Você não pode compartilhar um cronogramas que ja passou'
        }
      })
    }

    Kue.dispatch(
      Job.key,
      { name: auth.user.name, email, schedule },
      { attempts: 3 }
    )

    return response
      .status(200)
      .send({ message: 'Seu email será enviado em alguns instantes' })
  }
}

module.exports = SheredScheduleController
