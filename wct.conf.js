var request=require('request');

module.exports = {
    verbose: false,
    testTimeout: 5 * 60 * 1000,
    plugins: {
        sauce: {
            disabled: true,
            browsers: [
                "Windows 8.1/internet explorer",
                "Windows 7/internet explorer@10",
                "OS X 10.10/chrome",
                "OS X 10.10/firefox",
                "OS X 10.10/safari",
                "OS X 10.11/safari"
            ],
            'tunnelId': process.env.TRAVIS_JOB_NUMBER
        }
    },
    registerHooks: function(wct) {
         wct.on('browser-end', function(browser, error, stats, sessionId ) {
            if (!sessionId || !process.env.TRAVIS_JOB_NUMBER) return;

            var payload = {
              "name": process.env.TRAVIS_BRANCH+"_"+browser.browserName+"@"+browser.platform,
              "build": process.env.TRAVIS_BUILD_NUMBER,
              "custom-data": stats
            };
            if (process.env.TRAVIS_TAG)
                payload.tags = [process.env.TRAVIS_TAG];

            wct.emit('log:debug', 'Updating sauce job ', sessionId, payload);

            var username  = process.env.SAUCE_USERNAME;
            var accessKey = process.env.SAUCE_ACCESS_KEY;
            request.put({
              url:  'https://saucelabs.com/rest/v1/' + encodeURIComponent(username) + '/jobs/' + encodeURIComponent(sessionId),
              auth: {user: username, pass: accessKey},
              json: true,
              body: payload
            }).on('response',function(response) {
                wct.emit('log:debug',
                    'Update complete https://saucelabs.com/rest/v1/' + encodeURIComponent(username) + '/jobs/' + encodeURIComponent(sessionId)+' ('+response.statusCode+') '+response.statusMessage);
            });
          });
    }
};
