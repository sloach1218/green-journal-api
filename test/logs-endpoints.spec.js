const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Log Updates Endpoints', function() {
  let db

  const {
    testUsers,
    testPlants,
    testLogs
  } = helpers.makeLogsFixtures()

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

  describe(`GET /api/plants/:plant_id/logs/`, () => {
    const plantId = testPlants[1].id
    context(`Given no authorization`, () => {
      
      beforeEach('insert logs', () => {
        helpers.seedLogsTables(
          db,
          testUsers,
          testPlants,
          testLogs
        )
      })
      
      
      
      it(`responds with 401 unauthorized`, () => {
        return supertest(app)
          .get(`/api/plants/${plantId}/logs`)
          .expect(401)
      })
    })
    
    context(`Given no logs`, () => {
      beforeEach('insert users', () =>
        helpers.seedPlantsTables(
          db,
          testUsers,
          testPlants
        )
      )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`/api/plants/${plantId}/logs/`)
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200, [])
      })
    })

    context('Given there are logs in the database', () => {
      beforeEach('insert logs', () => {
        helpers.seedLogsTables(
          db,
          testUsers,
          testPlants,
          testLogs
        )
      })

      it('responds with 200 and logs of specified plant', () => {
        

        return supertest(app)
          .get(`/api/plants/${plantId}/logs`)
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200)
      })
    

    })
  })
  describe(`POST /api/logs`, () => {
    

    beforeEach('insert users', () =>
      helpers.seedPlantsTables(
        db,
        testUsers,
        testPlants
      )
      )

    it(`creates a log, responding with 201 and the new log`, function() {
      this.retries(3)
      
      const newLog = {
        text: 'Planty',
        image: 'plant.jpg',
        plant_id: '2',

      }
      
      return supertest(app)
        .post('/api/logs')
        .set('Authorization', helpers.makeAuthHeader(validUser))
        .send(newLog)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newLog.name)
          expect(res.body.image).to.eql(newLog.image)
          expect(res.body).to.have.property('id')
        })
    })
    
  })
  
  describe('DELETE /api/logs', () => {

    context('Given there are plants in the database', () => {

      beforeEach('insert logs', () => {
        helpers.seedLogsTables(
          db,
          testUsers,
          testPlants,
          testLogs
        )
      })

      it('removes the log by ID from the store', () => {
        const idToRemove = {log_id:2}
        return supertest(app)
          .delete(`/api/logs`)
          .send(idToRemove)
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(204)
          
      })
    })
  })
}) 
