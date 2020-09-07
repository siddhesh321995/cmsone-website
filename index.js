
const environments = require('./environment');
const { MongoDBManager } = require('./db-manager/manager');
const SessionManager = require('./session/session');
var cookieParser = require('cookie-parser');
var uuidv4 = require('uuid');

// setup environment
environments.setup();

const getVersion = function () {
  var major = 2;
  var minor = 0;
  var patch = 0;

  return {
    version: 'v' + major + '.' + minor + '.' + patch,
    major,
    minor,
    patch
  };
};

/**
 * @typedef {{sessionCollectionName:string;}} SetupOptions
 */

/**
 * @typedef {{MONGODB_CONNECTION:string;HAS_CERT:boolean;DATABASE_NAME:string;EMAILID:string;EMAIL_PASSWORD:string}} EnvironmentConfigs
 */

/**
 * @typedef {{[env:string]:EnvironmentConfigs}} Configs
 */

/**
 * Sets up your express app
 * @param {Object} app Express API App
 * @param {Configs} mainConfig Env config like mongo connection string, email config etc
 * @param {SetupOptions} otherConfigs Other options
 */
const setup = (app, mainConfig, otherConfigs = {}) => {
  if (otherConfigs.sessionCollectionName == void 0) { otherConfigs.sessionCollectionName = 'session'; }

  const config = environments.envs[process.env.NODE_ENV];
  /**
   * @type {EnvironmentConfigs}
   */
  let usedConfig;

  if (!mainConfig) {
    usedConfig = config;
  } else {
    usedConfig = mainConfig[process.env.NODE_ENV];
  }

  // Configure database
  MongoDBManager.configure({
    connectionString: usedConfig.MONGODB_CONNECTION,
    hasCert: usedConfig.HAS_CERT,
    certPath: __dirname + "/ssl.cert",
    dbName: usedConfig.DATABASE_NAME
  });

  SessionManager.setCollectionName(otherConfigs.sessionCollectionName);

  app.use(cookieParser());
  app.use(function (request, response, next) {
    if (request.cookies["asession"]) {
      next();
      return;
    }

    var sessionid = uuidv4.v4();
    response.cookie("asession", sessionid);
    SessionManager.createSession(sessionid, () => {
      next();
    }, () => {
      next();
    });
  });

  app.get('/end-session', function (request, response) {
    var sessionid = request.cookies["asession"];

    if (!sessionid) {
      response.status(403).send({ message: 'No session found!' });
      return;
    }

    SessionManager.endSession(sessionid, () => {
      response.status(200).send({ message: 'Request is complete' });
    }, (err) => {
      response.status(403).send({ message: 'Cannot complete request', details: err });
    });
  });
};

module.exports = {
  Main: {
    setup,
    getVersion
  },
  MongoManager: require('./db-manager/manager'),
  SessionManager
};
