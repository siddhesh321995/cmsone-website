# CMS One Website
> Simple light weight node-express based CMS Website

## Installation:

```
npm install cmsone-website --save
```

```
const { Main } = require('cmsone-website');
```

## Serverside setup
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

## Clientside setup
- Copy and Paste public folder to your public root directory
- Specify valid API_URL from public\js\common\app.js
- Specify valid auth_key from data\auth.json
- Navigate to /admin from browser to complete setup using GUI

```
    <!-- Add following scripts to your public html pages to enable tracking and analysis -->
    <script src="/js/common/polyfill.min.js"></script>
    <script src="/js/common/ajax.js"></script>
    <script src="/js/common/browser.js"></script>
    <script src="/js/common/app.js"></script>
    <script src="/js/common/event-api.js"></script>
    <script src="/js/common/app-bootstrapper.js"></script>
```

## Features:
- Works with express.js and mongo as database.
- Provides features like Tracking.
- Easily extend by writing your APIs
- Works best with CMS One API (backend helper for your CMS)