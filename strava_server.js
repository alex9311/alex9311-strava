'use strict';

const Future = Npm.require('fibers/future');
const request = Npm.require('request');

/**
 * Define the base object namespace. By convention we use the service name
 * in PascalCase (aka UpperCamelCase). Note that this is defined as a package global.
 */
Strava = {};

/**
 * Boilerplate hook for use by underlying Meteor code
 */
Strava.retrieveCredential = (credentialToken, credentialSecret) => {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

/**
 * include fields from strava
 * http://strava.github.io/api/v3/athlete/
 */
Strava.whitelistedFields = ['firstname', 'lastname', 'sex', 'profile_medium', 'email', 'country'];

/**
 * Register this service with the underlying OAuth handler
 * (name, oauthVersion, urls, handleOauthRequest):
 *  name = 'strava'
 *  oauthVersion = 2
 *  urls = null for OAuth 2
 *  handleOauthRequest = function(query) returns {serviceData, options} where options is optional
 * serviceData will end up in the user's services.strava
 */
OAuth.registerService('strava', 2, null, function(query) {

  /**
   * Make sure we have a config object for subsequent use (boilerplate)
   */
  const config = ServiceConfiguration.configurations.findOne({
    service: 'strava'
  });
  if (!config) {
    throw new ServiceConfiguration.ConfigError();
  }

  const tokenResponse= getTokenResponse(query, config)
  const userData = tokenResponse.athlete;
  const serviceData = {
    accessToken: tokenResponse.access_token,
    id: userData.id
  };

  const fields = _.pick(userData, Strava.whitelistedFields);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {
      profile: {
        name: userData.firstname,
        email: userData.email,
        fullName: userData.firstname + ' ' + userData.lastname,
        gender: userData.sex,
        location: userData.country
      }
    }
  };

});

// returns an object containing:
// token_type
// access_token
// athlete
const getTokenResponse = function (query, config) {

  var request_params = {
    grant_type: "authorization_code",
    code: query.code,
    client_id: config.client_id,
    client_secret: OAuth.openSecret(config.secret),
    redirect_uri: OAuth._redirectUri('strava', config),
  };
  var paramlist = [];
  for (var pk in request_params) {
    paramlist.push(pk + "=" + request_params[pk]);
  };
  var body_string = paramlist.join("&");

  var request_details = {
    method: "POST",
    uri: 'https://www.strava.com/oauth/token',
    body: body_string
  };

    var fut = new Future();
    request(request_details, function(error, response, body) {
       var responseContent;
      try {
        responseContent = JSON.parse(body);
      } catch(e) {
        error = new Meteor.Error(204, 'Response is not a valid JSON string.');
        fut.throw(error);
      } finally {
        fut.return(responseContent);
      }
    });
    var res = fut.wait();
    return res;
};
