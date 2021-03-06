require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('../auth/auth-router')
const plantsRouter = require('./plants/plants-router')
const usersRouter = require('./users/users-router')
const logsRouter = require('./logs/logs-router')

const imageUploadRouter = require('./image-uploader/image-upload-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use('/api', imageUploadRouter)

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/plants', plantsRouter)
app.use('/api/logs', logsRouter)



app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
  })

module.exports = app