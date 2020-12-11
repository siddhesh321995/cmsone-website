
const environments = require('./environment');
const { MongoDBManager } = require('mongo-driverify');
const SessionManager = require('./session/session');
var cookieParser = require('cookie-parser');
var uuidv4 = require('uuid');
var request = require('request');
var fs = require('fs');

// setup environment
environments.setup();

const getVersion = function () {
  var major = 1;
  var minor = 5;
  var patch = 2;

  return {
    version: 'v' + major + '.' + minor + '.' + patch,
    major,
    minor,
    patch
  };
};

const page404Prom = new Promise((res, rej) => {
  fs.readFile('public/error_pages/404.html', "utf8", function (err, data) {
    if (err) {
      return rej(err);
    }
    res(data);
  });
});

/**
 * @typedef {{sessionCollectionName:string;disableDynamicPageLoading:boolean;}} SetupOptions
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
  if (otherConfigs.disableDynamicPageLoading == void 0) { otherConfigs.disableDynamicPageLoading = false; }

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

  let cache = {};
  let siteInfo;

  if (!otherConfigs.disableDynamicPageLoading) {
    app.use(async function (req, response, next) {
      if (cache[req.originalUrl] && cache[req.originalUrl].found == true) {
        return response.status(200).send(cache[req.originalUrl].response);
      } else if (cache[req.originalUrl] && cache[req.originalUrl].false == true) {
        next();
        return;
      } else {
        if (!siteInfo) {
          siteInfo = await MongoDBManager.getInstance().getDocumentsByProm('siteinfo');
          if (siteInfo.length == 0) {
            next();
            return;
          }
        }
        const proto = (siteInfo[0].isHttps) ? 'https://' : 'http://';
        request.post(
          proto + siteInfo[0].apiurl + '/pagecontent/pagedetails',
          {
            json: {
              pageurl: req.originalUrl
            },
          },
          (error, res, body) => {
            if (error) {
              next();
              cache[req.originalUrl] = { found: false };
              return;
            }
            if (body.found) {
              let contentstrs = '';
              for (const content of body.pageContent) {
                contentstrs += content.contentstr;
              }
              cache[req.originalUrl] = { found: true, response: contentstrs };
              return response.status(200).send(cache[req.originalUrl].response);

            } else {
              next();
              cache[req.originalUrl] = { found: false };
              return;
            }
          }
        )
      }
    });
  }

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

  app.get('/clear-cache', function (request, response) {
    cache = {};
    siteInfo = null;
    response.status(200).send({ message: 'Request is complete, cache is cleared' });
  });
};

const setErrorPages = (app) => {
  app.use(function (req, res, next) {
    // respond with html page
    if (req.accepts('html')) {
      page404Prom.then((html) => {
        res.status(404).send(html);
      }).catch(() => {
        res.status(404).send('Not found');
      });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.status(404).send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').status(404).send('Not found');
  });
};

module.exports = {
  Main: {
    setup,
    getVersion,
    setErrorPages
  },
  MongoManager: require('mongo-driverify'),
  SessionManager
};
