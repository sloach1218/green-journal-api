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

    .patch(requireAuth, jsonBodyParser, (req, res, next) => {
      const { name, type, description, sunlight, water, fertilize, repot, image } = req.body
      const plantToUpdate = { name, type, description, sunlight, water, fertilize, repot, image }
      
      const numberOfValues = Object.values(plantToUpdate).filter(Boolean).length
      if (numberOfValues === 0) {
        return res.status(400).json({
          error: {
            message: `Request body must contain either name, type, description, sunlight, water, fertilize, repot, image`
          }
        })
      }
    
      PlantsService.updatePlant(
        req.app.get('db'),
        req.body.id,
        plantToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
    })

plantsRouter
  .route('/:plant_id')
  .all(requireAuth)
  .all(checkPlantExists)
  .get((req, res) => {
    res.json(PlantsService.serializePlant(res.plant))
  }) 

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
async function checkPlantExists(req, res, next) {
  try {
    const plant = await PlantsService.getById(
      req.app.get('db'),
      req.params.plant_id
    )

    if (!plant)
      return res.status(404).json({
        error: `Plant doesn't exist`
      })

    res.plant = plant
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = plantsRouter
