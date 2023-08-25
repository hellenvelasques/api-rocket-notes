const sqliteConection = require('../../sqlite');
const createUsers = require('./createUsers');

async function migrationsRun() {
  const schemas = [
    createUsers
  ].join('');

  sqliteConection()
  .then(db => db.exec(schemas))
  .catch(error => console.log(error));
}

module.exports = migrationsRun;