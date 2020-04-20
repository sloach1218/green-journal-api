const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Plants Endpoints', function() {
  let db

  const {
    testUsers,
    testPlants,
  } = helpers.makePlantsFixtures()

  const validUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })
  
  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/plants`, () => {
    context(`Given no authorization`, () => {
      it(`responds with 401 unauthorized`, () => {
        return supertest(app)
          .get('/api/plants')
          .expect(401)
      })
    })
    
    context(`Given no plants`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsersTables(
          db,
          testUsers
        )
      )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/plants')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200, [])
      })
    })

    context('Given there are plants in the database', () => {
      beforeEach('insert plants', () =>
        helpers.seedPlantsTables(
          db,
          testUsers,
          testPlants
        )
      )

      it('responds with 200 and plants of specified user', () => {
        
        const expectedPlants = testPlants.map(plant =>
          helpers.makeExpectedPlant(
            testUsers,
            plant
          )
        )
        function isUser(plant){
          return plant.user === validUser.id;
        }

        const finalPlants = expectedPlants.filter(isUser);


        return supertest(app)
          .get('/api/plants')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200, finalPlants)
      })
    })

    context(`Given an XSS attack thing`, () => {
      
      
      const testUser = testUsers[0]
      const {
        maliciousPlant,
        expectedPlant,
      } = helpers.makeMaliciousPlant(testUser)

      beforeEach('insert malicious thing', () => {
        return helpers.seedMaliciousPlant(
          db,
          testUser,
          maliciousPlant,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/plants`)
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedPlant.name)
            expect(res.body[0].description).to.eql(expectedPlant.description)
          })
      })
    })
  })
  describe(`POST /api/plants`, () => {
    

    beforeEach('insert users', () =>
        helpers.seedUsersTables(
          db,
          testUsers
        )
      )

    it(`creates a plant, responding with 201 and the new plant`, function() {
      this.retries(3)
      
      const newPlant = {
        name: 'Planty',
        type: 'plant',
        description: 'likes water and sun, but not too much',
        sunlight: 'Bright',
        water: 6,
        fertilize: 4,
        repot: 12,
        image: 'plant.jpg',

      }
      
      return supertest(app)
        .post('/api/plants')
        .set('Authorization', helpers.makeAuthHeader(validUser))
        .send(newPlant)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newPlant.name)
          expect(res.body.type).to.eql(newPlant.type)
          expect(res.body.description).to.eql(newPlant.description)
          expect(res.body.sunlight).to.eql(newPlant.sunlight)
          expect(res.body.water).to.eql(newPlant.water)
          expect(res.body.fertilize).to.eql(newPlant.fertilize)
          expect(res.body.water).to.eql(newPlant.water)
          expect(res.body.image).to.eql(newPlant.image)
          expect(res.body).to.have.property('id')
        })
    })

    const requiredFields = ['name', 'type', 'description', 'sunlight', 'water', 'fertilize', 'repot', 'image']

    requiredFields.forEach(field => {
      
      const newPlant = {
        name: 'Planty',
        type: 'plantlike',
        description: 'likes water and sun, but not too much',
        sunlight: 'Bright',
        water: 6,
        fertilize: 4,
        repot: 12,
        image: 'plant.jpg',
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newPlant[field]

        return supertest(app)
          .post('/api/plants')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .send(newPlant)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })
  describe(`PATCH /api/plants`, () => {
    context(`Given no plants`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsersTables(
          db,
          testUsers
        )
      )
      it(`responds with 400`, () => {
        return supertest(app)
          .patch(`/api/plants`)
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(400, { error: { message: `Request body must contain either name, type, description, sunlight, water, fertilize, repot, image` } })
      })
    })

    context('Given there are plants in the database', () => {

      beforeEach('insert plants', () =>
        helpers.seedPlantsTables(
          db,
          testUsers,
          testPlants
        )
      )
      it(`responds with 400 when no required fields supplied`, () => {
        
        return supertest(app)
          .patch(`/api/plants`)
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain either name, type, description, sunlight, water, fertilize, repot, image`
            }
          })
      })

      it('responds with 204 and updates the plant', () => {
        const updatePlant = {
          name: 'updated plant name',
          description: 'updated plant description',
          sunlight: 'Bright',
          water: 7,
          fertilize: 2,
          repot: 12,
          image: 'http://placehold.it/500x500',
          id: 2,
        }

        return supertest(app)
          .patch(`/api/plants`)
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .send(updatePlant)
          .expect(204)
          
      }) 

      

    })
  })
  describe('DELETE /api/plants', () => {

    context('Given there are plants in the database', () => {

      beforeEach('insert plants', () => {
        helpers.seedPlantsTables(
          db,
          testUsers,
          testPlants
        )
      })

      it('removes the plant by ID from the store', () => {
        const idToRemove = {plant_id:2}
        return supertest(app)
          .delete(`/api/plants`)
          .send(idToRemove)
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(204)
          
      })
    })
  })
}) 
