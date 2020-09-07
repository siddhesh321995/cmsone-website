const envs = {
  production: {
    MONGODB_CONNECTION: 'mongodb+srv://XXXX:XXXX@XXXX.mongodb.net/XXXX',
    HAS_CERT: false,
    DATABASE_NAME: 'CMSOne',
    EMAILID: 'cmsone@gmail.com',
    EMAIL_PASSWORD: 'XXXX'
  },
  local: {
    MONGODB_CONNECTION: 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false',
    HAS_CERT: false,
    DATABASE_NAME: 'CMSOne',
    EMAILID: 'cmsone@gmail.com',
    EMAIL_PASSWORD: 'XXXX'
  },
  stage: {
    MONGODB_CONNECTION: 'mongodb+srv://XXXX:XXXX@XXXX.mongodb.net/XXXX',
    HAS_CERT: false,
    DATABASE_NAME: 'CMSOne',
    EMAILID: 'cmsone@gmail.com',
    EMAIL_PASSWORD: 'XXXX'
  }
};

const setupApp = function () {
  for (var i = 0; i < process.argv.length; i++) {
    var currArg = process.argv[i];
    if (currArg.indexOf('=') != -1) {
      var split = currArg.split('=');
      process.env[split[0]] = split[1];
    }
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
  }
};

module.exports = { envs: envs, setup: setupApp };