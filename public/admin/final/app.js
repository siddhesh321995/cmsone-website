'use strict';

var AEnvironment = window.AEnvironment || {};

AEnvironment.ADMIN_COLELCTION_URL = AEnvironment.API_URL + '/admin/collection';
AEnvironment.ADMIN_COLELCTION_DISTINCT_URL = AEnvironment.API_URL + '/admin/collection/dist';

AEnvironment.SESSION_CHECK_URL = AEnvironment.API_URL + '/admin/sessioncheck';
AEnvironment.LOGIN_URL = AEnvironment.API_URL + '/admin/login';
AEnvironment.REGISTER_URL = AEnvironment.API_URL + '/admin/register';
AEnvironment.LOGOUT_URL = AEnvironment.API_URL + '/admin/logout';
AEnvironment.FORGOT_PASSWORD_URL = AEnvironment.API_URL + '/admin/forgotpassword';
AEnvironment.VALIDATE_PASS_RESET_URL = AEnvironment.API_URL + '/admin/validateresetrequest';
AEnvironment.RESET_PASSWORD_URL = AEnvironment.API_URL + '/admin/resetpassword';

AEnvironment.ANALYTICS_SUMMARY_URL = AEnvironment.API_URL + '/analytics/summary/{{authtoken}}';
AEnvironment.ANALYTICS_SESSION_DETAILS_URL = AEnvironment.API_URL + '/analytics/sessiondetails';

AEnvironment.ANALYTICS_VISITORS_URL = AEnvironment.API_URL + '/analytics/visitorsfordays/{{days}}/{{authtoken}}';
AEnvironment.ANALYTICS_ACTIVITY_URL = AEnvironment.API_URL + '/analytics/activityfordays/{{days}}/{{authtoken}}';

AEnvironment.REVIEW_URL = AEnvironment.API_URL + '/review';

AEnvironment.API_CONFIG_IS = AEnvironment.API_URL + '/isconfigured';
AEnvironment.API_CONFIG = AEnvironment.API_URL + '/siteinfo/configure';
AEnvironment.ADMIN_SETTINGS = AEnvironment.API_URL + '/siteinfo/settings';

AEnvironment.CONFIG_IS = AEnvironment.CURRENTHOST_URL + '/isconfigured';
AEnvironment.CONFIG = AEnvironment.CURRENTHOST_URL + '/configure';

AEnvironment.CONTENT_FOLDERS = AEnvironment.API_URL + '/contentfolder/site/{{authtoken}}';
AEnvironment.CONTENT_FOLDERS_BASE = AEnvironment.API_URL + '/contentfolder';

AEnvironment.CONTENT_ITEM = AEnvironment.API_URL + '/contentitem';
AEnvironment.CONTENT_ITEM_BY_FOLDER = AEnvironment.API_URL + '/contentitem/folderid/{{folderid}}/{{authtoken}}';

AEnvironment.MENU_FOLDER_SITE = AEnvironment.API_URL + '/menufolder/site/{{authtoken}}';
AEnvironment.MENU_FOLDER = AEnvironment.API_URL + '/menufolder';

AEnvironment.PAGE = AEnvironment.API_URL + '/page';
AEnvironment.PAGE_BY_FOLDER = AEnvironment.API_URL + '/page/folderid/{{folderid}}/{{authtoken}}';

AEnvironment.PAGE_CONTENT = AEnvironment.API_URL + '/pagecontent';
AEnvironment.PAGE_CONTENT_BY_PAGE = AEnvironment.API_URL + '/pagecontent/page/{{pageid}}/{{authtoken}}';