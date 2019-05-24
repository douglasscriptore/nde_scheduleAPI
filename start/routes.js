'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User/store')
Route.post('auth', 'SessionController.store').validator('Session')

/**
 * ROTAS AUTENTICADAS
 */
Route.group(() => {
  // User
  Route.put('users', 'UserController.update').validator('User/update')

  // Schedule
  Route.resource('schedules', 'ScheduleController')
    .apiOnly()
    .validator(new Map([[['schedules.store'], ['Schedule/store']]]))

  // shared
  Route.post('schedules/:id/share', 'SheredScheduleController.store').validator(
    'Share/store'
  )
}).middleware(['auth'])
