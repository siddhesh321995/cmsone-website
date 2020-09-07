# CMS One API
> Simple light weight node-express based API wrapper

## Usage:

```
npm install cmsone-website --save
```

```
const { Main } = require('cmsone-website');
```

Setup your API environment
```
const express = require('express');
const app = express();

Main.setup(app, {
    production: {
        MONGODB_CONNECTION: 'mongodb+srv://XXXX:XXXX@XXXX-XXXX.mongodb.net/XXXX',
        HAS_CERT: false,
        DATABASE_NAME: 'XXXX',
        EMAILID: 'XXXX@gmail.com',
        EMAIL_PASSWORD: 'password'
    }
});
```

## Features:
- Works with express.js and mongo as database.
- Provides features like Tracking.
- Easily extend by writing your APIs
- Works best with CMS One API (backend helper for your CMS)