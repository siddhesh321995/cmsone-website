# CMS One Website
> Simple light weight node-express based CMS Website

[![Build Status](https://travis-ci.com/siddhesh321995/cmsone-website.svg?branch=master)](https://travis-ci.com/siddhesh321995/cmsone-website)
![Node.js CI](https://github.com/siddhesh321995/cmsone-website/workflows/Node.js%20CI/badge.svg?branch=master)

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

// Setup custom error pages
Main.setErrorPages(app);
```

## Clientside setup
- Copy and Paste public folder to your public root directory
- Specify valid API_URL from `public\js\environment.js`
- Add auth.json with any authkey at data/ folder. (this key will be used while configuring CMS from GUI)
- Navigate to `/admin` from browser to complete setup using GUI.

```
<!-- Add following scripts to your public html pages to enable tracking and analysis -->
<script src="/vendor/jquery/3.5.1/jquery-3.5.1.min.js"></script>
<script src="/js/common/polyfill.min.js"></script>
<script src="/js/environment.js"></script>
<script src="/js/final/bundle.min.js"></script>
```

## Features:
- Works with express.js and mongo as database.
- Provides features like Tracking.
- Easily extend by writing your APIs.
- Contact Us, News letter management, Custom error pages etc.
- Works best with [CMS One API](https://github.com/siddhesh321995/cmsone-api) (backend helper for your CMS)
