const express = require('express')
const PlantsService = require('./plants-service')
//const { requireAuth } = require('../../middleware/jwt-auth')

const plantsRouter = express.Router()

plantsRouter
  .route('/')
  .get((req, res, next) => {
    PlantsService.getAllThings(req.app.get('db'))
      .then(plants => {
        res.json(PlantsService.serializeThings(plants))
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
