process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  var cfg = {
    basePath: '../../',
    frameworks: ['jasmine'],
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    singleRun: true,
    port: 9876
  };
  
  config.set(cfg);
};
