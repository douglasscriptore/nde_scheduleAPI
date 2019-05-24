'use strict'

const Mail = use('Mail')

class SharedScheduleMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'SharedScheduleMail-job'
  }

  // This is where the work is done.
  async handle ({ name, email, schedule }) {
    console.log(`Job: ${SharedScheduleMail.key}`)
    try {
      await Mail.send(
        ['emails.shared_schedules'],
        { name, schedule },
        message => {
          message
            .to(email)
            .from('douglasscriptore@gmail.com', 'Douglas | Schedule Task')
            .subject(`Você tem um novo cronograma: ${schedule.title}`)
        }
      )
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = SharedScheduleMail
