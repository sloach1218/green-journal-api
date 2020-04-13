const express = require('express')
const PlantsService = require('./plants-service')
const { requireAuth } = require('../../middleware/jwt-auth')

const plantsRouter = express.Router()
const jsonBodyParser = express.json()

plantsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    PlantsService.getByUserId(req.app.get('db'), req.user.id)
      .then(plants => {
        res.json(PlantsService.serializePlants(plants))
      })
      .catch(next)
  })
  
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { name, type, description, sunlight, water, fertilize, repot, image } = req.body
    const newPlant = { name, type, description, sunlight, water, fertilize, repot, image }

    for (const [key, value] of Object.entries(newPlant))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    newPlant.user_id = req.user.id

    PlantsService.insertPlant(
      req.app.get('db'),
      newPlant
    )
      .then(plant => {
        res
          .status(201)
          //.location(path.posix.join(req.originalUrl, `/${plant.id}`))
          .json(PlantsService.serializePlant(plant))
      })
      .catch(next)
    })
/*
plantsRouter
  .route('/:plant_id')
  .all(requireAuth)
  .all(checkThingExists)
  .get((req, res) => {
    res.json(PlantsService.serializeThing(res.thing))
  }) */

/*
plantsRouter.route('/:plant_id/logs/')
  .all(requireAuth)
  .all(checkPlantExists)
  .get((req, res, next) => {
    PlantsService.getLogsForPlant(
      req.app.get('db'),
      req.params.plant_id
    )
      .then(reviews => {
        res.json(PlantsService.serializePlantLogs(logs))
      })
      .catch(next)
  }) */

/* async/await syntax for promises */
/*async function checkThingExists(req, res, next) {
  try {
    const thing = await PlantsService.getById(
      req.app.get('db'),
      req.params.thing_id
    )

    if (!thing)
      return res.status(404).json({
        error: `Thing doesn't exist`
      })

    res.thing = thing
    next()
  } catch (error) {
    next(error)
  }
}*/

module.exports = plantsRouter
