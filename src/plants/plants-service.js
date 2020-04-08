const xss = require('xss')
const Treeize = require('treeize')

const PlantsService = {
  getAllThings(db) {
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
      )
      
  },
  getById(db, id) {
    return PlantsService.getAllThings(db)
      .where('plant.id', id)
      .first()
  },

  

  serializeThings(plants) {
    return plants.map(this.serializeThing)
  },

  serializeThing(plant) {
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
