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

  
}



module.exports = PlantsService
