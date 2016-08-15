module.exports = function(config) {
  var cfg = {
    basePath: '../../',
    frameworks: ['jasmine'],
    browsers: ['Chrome', 'Firefox'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true,
    port: 9876
  };
  
  if (process.env.TRAVIS) {
      cfg.browsers = ['Firefox', 'Chrome_travis_ci'];
  }
  
  config.set(cfg);
};
