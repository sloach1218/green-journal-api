const xss = require('xss')
const Treeize = require('treeize')

const PlantsService = {
  getAllPlants(db) {
    return db
      .from('gj_plants AS plant')
      .select(
        'plant.id',
        'plant.name',
        'plant.type',
        'plant.description',
        'plant.image',
        'plant.sunlight',
        'plant.water',
        'plant.fertilize',
        'plant.repot',
        'plant.date_created',
        'plant.user_id',

      )
      
  },
  getById(db, id) {
    return PlantsService.getAllPlants(db)
      .where('plant.id', id)
      .first()
  },
  getByUserId(db, userId){
    return PlantsService.getAllPlants(db)
      .where('plant.user_id', userId)
      
  },

  

  serializePlants(plants) {
    return plants.map(this.serializePlant)
  },

  serializePlant(plant) {
    const plantTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const plantData = plantTree.grow([ plant ]).getData()[0]

    return {
      id: plantData.id,
      name: xss(plantData.name),
      type: xss(plantData.type),
      description: xss(plantData.description),
      sunlight: xss(plantData.sunlight),
      water: plantData.water,
      fertilize: plantData.fertilize,
      repot: plantData.repot,
      date_created: plantData.date_created,
      image: plantData.image,
      user: plantData.user_id,
    }
  },
  insertPlant(db, newPlant) {
    return db
      .insert(newPlant)
      .into('gj_plants')
      .returning('*')
      .then(([plant]) => plant)
      
  },
  updatePlant(db, id, newPlantFields){
    return db
        .into('gj_plants')
        .where({id})
        .update(newPlantFields)
  },
  getLogsForPlant(db, plant_id) {
    return db
      .from('gj_logs AS log')
      .select(
        'log.id',
        'log.image',
        'log.text',
        'log.date_created',
        ...userFields,
      )
      .where('log.plant_id', plant_id)
      .leftJoin(
        'gj_users AS usr',
        'log.user_id',
        'usr.id',
      )
      .groupBy('log.id', 'usr.id')
      .orderBy('log.date_created', 'desc')
  },
  serializePlantLogs(logs) {
    return logs.map(this.serializePlantLog)
  },
  serializePlantLog(log) {
    const logTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const logData = logTree.grow([ log ]).getData()[0]

    return {
      id: logData.id,
      image: logData.image,
      plant_id: logData.plant_id,
      text: xss(logData.text),
      user: logData.user || {},
      date_created: logData.date_created,
    }
  },

  
}
const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.date_created AS user:date_created',
]



module.exports = PlantsService
