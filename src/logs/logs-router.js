const express = require('express')
//const path = require('path')
const LogsService = require('./logs-service')
const { requireAuth } = require('../../middleware/jwt-auth')

const logsRouter = express.Router()
const jsonBodyParser = express.json()

logsRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { plant_id, image, text } = req.body
    const newLog = { plant_id, image, text  }


    const numberOfValues = Object.values(newLog).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: `Request body must contain either text or image`
          }
        })
      }

    /*for (const [key, value] of Object.entries(newLog))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })*/
    newLog.user_id = req.user.id

    LogsService.insertLog(
      req.app.get('db'),
      newLog
    )
      .then(log => {
        res
          .status(201)
          //.location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(LogsService.serializeLog(log))
      })
      .catch(next)
    })

    .delete(requireAuth, jsonBodyParser,(req, res, next) => {
      const { log_id } = req.body
      
      LogsService.deleteLog(
        req.app.get('db'),
        log_id
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
    })

module.exports = logsRouter
