'use strict'

const moment = require('moment')

const Schedule = use('App/Models/Schedule')

class ScheduleController {
  async index ({ request, response, auth }) {
    const { date, page } = request.get()
    const { id } = auth.user

    // const schedules = Schedule.query()
    //   .where('user_id', id)
    //   .where('event_date', '>', moment(date))
    //   .fetch()
    let query = Schedule.query()
      .where('user_id', id)
      .with('user')

    if (date) {
      // query = query.whereRaw(`"event_date"::date = ?`, '2019-05-24')
      query = query.whereRaw(`DATE_FORMAT(event_date, '%Y-%m-%d') = ?`, date)
    }

    const schedules = await query.paginate(page)

    return schedules
  }

  async show ({ params, response, auth }) {
    try {
      const schedule = await Schedule.findOrFail(params.id)

      if (schedule.user_id !== auth.user.id) {
        return response.status(401).send({
          error: {
            message:
              'Você não tem permissão para ver o cronograma de outro usuario'
          }
        })
      }

      return schedule
    } catch (err) {
      return response.status(500).send({
        error: {
          message: 'Algo deu errado, este cronograma existe?'
        }
      })
    }
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'event_date'])
    const { id } = auth.user

    const haveSchedule = await Schedule.query()
      .where('user_id', id)
      .where('event_date', data.event_date)
      .fetch()
    if (haveSchedule.rows.length > 0) {
      return response.status(401).send({
        error: {
          message: 'Não é possível definir dois eventos no mesmo horário.'
        }
      })
    }

    const schedule = Schedule.create({
      ...data,
      user_id: id
    })

    return schedule
  }

  async update ({ params, request, response, auth }) {
    try {
      // recupera schedule
      const schedule = await Schedule.findOrFail(params.id)

      // verifica usuario
      if (schedule.user_id !== auth.user.id) {
        return response.status(401).send({
          error: {
            message:
              'Você não tem permissão para editar o cronograma de outro usuario'
          }
        })
      }

      // verify if date is after today
      const isAfter = moment().isAfter(schedule.event_date)
      if (isAfter) {
        response.status(401).send({
          error: {
            message: 'Você não pode editar cronogramas que ja passaram'
          }
        })
      }

      // obtem os valores passados
      const data = request.only(['title', 'location', 'event_date'])

      try {
        const schedule = await Schedule.findByOrFail(
          'event_date',
          data.event_date
        )
        if (schedule.id !== Number(params.id)) {
          return response.status(401).send({
            error: {
              message: 'Não é possível definir dois eventos no mesmo horário.'
            }
          })
        }
      } catch (error) {}

      schedule.merge({ ...data })
      await schedule.save()
      return schedule
    } catch (error) {
      return response.status(500).send({
        error: {
          message: 'Algo deu errado, este cronograma existe?'
        }
      })
    }
  }

  async destroy ({ params, request, response, auth }) {
    // recupera schedule
    const schedule = await Schedule.findOrFail(params.id)

    // verifica usuario
    if (schedule.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message:
            'Você não tem permissão para deletar o cronograma de outro usuario'
        }
      })
    }

    // verify if date is after today
    const isAfter = moment().isAfter(schedule.event_date)

    if (isAfter) {
      response.status(401).send({
        error: {
          message: 'Você não pode deletar cronogramas que ja passaram'
        }
      })
    }
  }
}

module.exports = ScheduleController
