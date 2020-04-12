function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makeThingsArray(users) {
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
      user_id: users[1].id,
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
      user_id: users[0].id,
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
    date_created: plant.date_created,
    user: user.id,
  }
}





function makeMaliciousThing(user) {
  const maliciousThing = {
    id: 911,
    image: 'http://placehold.it/500x500',
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedThing = {
    ...makeExpectedThing([user], maliciousThing),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousThing,
    expectedThing,
  }
}

function makeThingsFixtures() {
  const testUsers = makeUsersArray()
  const testPlants = makeThingsArray(testUsers)
  return {  testPlants, testUsers }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      gj_plants,
      gj_users
      RESTART IDENTITY CASCADE`
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

function seedMaliciousThing(db, user, thing) {
  return db
    .into('thingful_users')
    .insert([user])
    .then(() =>
      db
        .into('thingful_things')
        .insert([thing])
    )
}

function makeAuthHeader(user){
  const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
  return `Basic ${token}`
}

module.exports = {
  makeUsersArray,
  makeThingsArray,
  makeExpectedPlant,
  makeMaliciousThing,

  makeThingsFixtures,
  cleanTables,
  seedPlantsTables,
  seedMaliciousThing,
  makeAuthHeader,
}
