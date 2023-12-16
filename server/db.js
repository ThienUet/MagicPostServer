const Promise = require('bluebird');
const mongoose = require('mongoose');
const chalk = require('chalk');
const dbConf = require('./config/config').dbConnection;

const {mongoURI} = dbConf;

const initMongoDB = () => {
    mongoose.Promise = Promise;
    return mongoose.connect(mongoURI)
    .then(() => {
        return Promise.all([])
        .then(() => {
            console.log("%s MongoDB: Connection successful", chalk.green("✓"));
            return true;
        });
    }).catch((error) => {
        console.log("err", error);
        console.warn("%s MongoDB: Connection failed!", chalk.red("✗"));
    })
};

const initSequelize = async () =>
  // currently just a stub
  false;

/**
 * A promise that resolves as soon as all the databases are ready to go.
 *
 * @type {Promise.<*[]>}
 */
const ready = Promise.all([initMongoDB(), initSequelize()]);

module.exports = {
  ready,
  /**
   * Returns the current Mongoose instance.
   *
   * @returns {Mongoose}
   */
  getMongoose: () => mongoose,
  /**
   * Returns the native MongoDB driver instance
   *
   * @returns {mongodb.Db}
   */
  getMongo: () => mongoose.connection.db,
  createConection: () => mongoose.connection
};
