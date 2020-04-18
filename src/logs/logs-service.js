const xss = require('xss')

const LogsService = {
  getById(db, id) {
    return db
      .from('gj_logs AS log')
      .select(
        'log.id',
        'log.text',
        'log.image',
        'log.date_created',
        'log.plant_id',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.date_created
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin(
        'gj_users AS usr',
        'log.user_id',
        'usr.id',
      )
      .where('log.id', id)
      .first()
      
      
  },

  insertLog(db, newLog) {
    return db
      .insert(newLog)
      .into('gj_logs')
      .returning('*')
      .then(([log]) => log)
      .then(log =>
        LogsService.getById(db, log.id)
      )
  },

  serializeLog(log) {
    return {
      id: log.id,
      text: xss(log.text),
      image: log.image,
      plant_id: log.plant_id,
      date_created: log.date_created,
      user: log.user || {},
    }
  },
  deleteLog(db, id){
    return db
        .from('gj_logs')
        .where({id})
        .delete()
},
}

module.exports = LogsService
