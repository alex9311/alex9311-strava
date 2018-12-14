Package.describe({
  name: 'alex93110:strava',
  version: '0.0.4',
  summary: 'OAuth handler for Strava',
  git: 'https://github.com/alex9311/alex9311-strava',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('accounts-ui', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use(['underscore', 'service-configuration'], ['client', 'server']);
  api.use(['random', 'templating'], 'client');

  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);

  api.export('Strava');

  api.addFiles(
    ['strava_configure.html', 'strava_configure.js'],
    'client');

  api.addFiles('strava_server.js', 'server');
  api.addFiles('strava_client.js', 'client');

  api.addFiles('accounts-strava_login_button.css', 'client');
  api.addFiles('accounts-strava.js');
});

Npm.depends({
  'request': '2.88.0',
  'fibers': '3.0.0'
});
