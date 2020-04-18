const jwt = require('jsonwebtoken')
const config = require('../src/config')


function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password1!',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password2',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password3',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password4',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makePlantsArray(users) {
  return [
    {
      id: 1,
      name: 'First test plant',
      type: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit',
      sunlight: 'Bright',
      water: 7,
      fertilize: 2,
      repot: 12,
      image: 'http://placehold.it/500x500',
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      name: 'Second test plant',
      type: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit',
      sunlight: 'Bright',
      water: 7,
      fertilize: 2,
      repot: 12,
      image: 'http://placehold.it/500x500',
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      name: 'Third test plant',
      type: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit',
      sunlight: 'Bright',
      water: 7,
      fertilize: 2,
      repot: 12,
      image: 'http://placehold.it/500x500',
      user_id: users[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      name: 'Fourth test plant',
      type: 'Lorem ipsum dolor sit',
      description: 'Lorem ipsum dolor sit',
      sunlight: 'Bright',
      water: 7,
      fertilize: 2,
      repot: 12,
      image: 'http://placehold.it/500x500',
      user_id: users[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makeLogsArray(users, plants) {
  return [
    {
      id: 1,
      text: 'test-log-1',
      image: 'http://placehold.it/500x500',
      plant_id: plants[2].id,
      user_id: users[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      text: 'test-log-2',
      image: 'http://placehold.it/500x500',
      plant_id: plants[0].id,
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      text: 'test-log-3',
      image: 'http://placehold.it/500x500',
      plant_id: 1,
      user_id: plants[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      text: 'test-log-4',
      image: 'http://placehold.it/500x500',
      plant_id: plants[1].id,
      user_id: users[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}



function makeExpectedPlant(users, plant) {
  const user = users
    .find(user => user.id === plant.user_id)

  return {
    id: plant.id,
    name: plant.name,
    type: plant.type,
    description: plant.description,
    sunlight: plant.sunlight,
    water: plant.water,
    fertilize: plant.fertilize,
    repot: plant.repot,
    image: plant.image,
    user: user.id,
    date_created: plant.date_created,
    
  }
}

function makeExpectedLog(users, plants, log) {
  const user = users
    .find(user => user.id === log.user_id)

  const plant = plants
    .find(plant => plant.id === log.plant_id)

  return {
    id: log.id,
    text: log.text,
    plant: plant.id,
    user: user.id,
    date_created: log.date_created,
    
  }
}





function makeMaliciousPlant(user) {
  const maliciousPlant = {
    id: 911,
    image: 'http://placehold.it/500x500',
    date_created: new Date().toISOString(),
    type: 'bad plant',
    sunlight: 'none',
    water:'234',
    repot:'234',
    fertilize:'234',
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedPlant = {
    ...makeExpectedPlant([user], maliciousPlant),
    name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousPlant,
    expectedPlant,
  }
}

function makePlantsFixtures() {
  const testUsers = makeUsersArray()
  const testPlants = makePlantsArray(testUsers)
  return { testPlants, testUsers }
}

function makeLogsFixtures() {
  const testUsers = makeUsersArray()
  const testPlants = makePlantsArray(testUsers)
  const testLogs = makeLogsArray(testPlants, testUsers)
  return { testLogs, testPlants, testUsers }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      gj_logs,
      gj_plants,
      gj_users
      RESTART IDENTITY CASCADE`
  )
}

function seedLogsTables(db, users, plants, logs) {
  return db
    .into('gj_users')
    .insert(users)
    .then(() =>
      db
        .into('gj_plants')
        .insert(plants)
    )
    .then(() =>
      db
        .into('gj_logs')
        .insert(logs)
    )
   
}

function seedPlantsTables(db, users, plants) {
  return db
    .into('gj_users')
    .insert(users)
    .then(() =>
      db
        .into('gj_plants')
        .insert(plants)
    )
   
}
function seedUsersTables(db, users) {
  return db
    .into('gj_users')
    .insert(users)
   
}

function seedMaliciousPlant(db, user, plant) {
  return db
    .into('gj_users')
    .insert([user])
    .then(() =>
      db
        .into('gj_plants')
        .insert([plant])
    )
}


function makeAuthHeader(user, secret = config.JWT_SECRET){
  const token = jwt.sign({ user_id:user.id}, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makePlantsArray,
  makeExpectedPlant,
  makeMaliciousPlant,
  makeLogsFixtures,
  makeExpectedLog,

  makePlantsFixtures,
  cleanTables,
  seedLogsTables,
  seedPlantsTables,
  seedUsersTables,
  seedMaliciousPlant,
  makeAuthHeader,
}
