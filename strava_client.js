'use strict';

/**
 * Define the base object namespace. By convention we use the service name
 * in PascalCase (aka UpperCamelCase). Note that this is defined as a package global (boilerplate).
 */
Strava = {};

/**
 * Request Strava credentials for the user (boilerplate).
 * Called from accounts-strava.
 *
 * @param {Object}    options                             Optional
 * @param {Function}  credentialRequestCompleteCallback   Callback function to call on completion. Takes one argument, credentialToken on success, or Error on error.
 */
Strava.requestCredential = function(options, credentialRequestCompleteCallback) {
  /**
   * Support both (options, callback) and (callback).
   */
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  /**
   * Make sure we have a config object for subsequent use (boilerplate)
   */
  const config = ServiceConfiguration.configurations.findOne({
    service: 'strava'
  });
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError()
    );
    return;
  }

  /**
   * Boilerplate
   */
  const credentialToken = Random.secret();
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  const display = mobile ? 'touch' : 'popup';
  let scope = '';
  if (options && options.requestPermissions) {
    scope = options.requestPermissions.join(',');
  }
  const loginStyle = OAuth._loginStyle('strava', config, options);

  const loginUrl = 'https://www.strava.com/oauth/authorize' +
    '?response_type=code' +
    '&client_id=' + config.client_id +
    '&redirect_uri=' + OAuth._redirectUri('strava', config) +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken) +
    '&scope=activity:read_all,activity:write';

  /**
   * Client initiates OAuth login request (boilerplate)
  */
  OAuth.launchLogin({
    loginService: 'strava',
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {
      height: 600
    }
  });
};
