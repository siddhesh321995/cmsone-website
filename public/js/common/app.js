var AEnvironment = window.AEnvironment || {};

// Specify CMS One API endpoint here..
AEnvironment.API_URL = '//localhost:5001';
AEnvironment.CURRENTHOST_URL = location.protocol + '//' + location.host;

AEnvironment.EVENT_API_URL = AEnvironment.API_URL + '/events/capture-it';
AEnvironment.CONTACT_US_API = AEnvironment.API_URL + '/contact-us';
AEnvironment.NEWS_LETTER_API = AEnvironment.API_URL + '/newsletter';
AEnvironment.REVIEW_API = AEnvironment.API_URL + '/review';
AEnvironment.REVIEW_BY_API = AEnvironment.API_URL + '/review/product/{{prodid}}';

AEnvironment.SESSION_END_URL = AEnvironment.CURRENTHOST_URL + '/end-session';

AEnvironment.V_MAJOR = 1;
AEnvironment.V_MINOR = 4;
AEnvironment.V_PATH = 0;
AEnvironment.VERSION = 'v' + AEnvironment.V_MAJOR + '.' +
    AEnvironment.V_MINOR + '.' + AEnvironment.V_PATH;