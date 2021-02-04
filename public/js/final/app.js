'use strict';

require('./browser');

var AEnvironment = window.AEnvironment || {};
window.AEnvironment = AEnvironment;

AEnvironment.CURRENTHOST_URL = location.protocol + '//' + location.host;

AEnvironment.EVENT_API_URL = AEnvironment.API_URL + '/events/capture-it';
AEnvironment.CONTACT_US_API = AEnvironment.API_URL + '/contact-us';
AEnvironment.NEWS_LETTER_API = AEnvironment.API_URL + '/newsletter';
AEnvironment.REVIEW_API = AEnvironment.API_URL + '/review';
AEnvironment.REVIEW_BY_API = AEnvironment.API_URL + '/review/product/{{prodid}}';

AEnvironment.SESSION_END_URL = AEnvironment.CURRENTHOST_URL + '/end-session';
AEnvironment.SESSION_START_URL = AEnvironment.CURRENTHOST_URL + '/get-session';

AEnvironment.V_MAJOR = 1;
AEnvironment.V_MINOR = 5;
AEnvironment.V_PATH = 2;
AEnvironment.VERSION = 'v' + AEnvironment.V_MAJOR + '.' + AEnvironment.V_MINOR + '.' + AEnvironment.V_PATH;