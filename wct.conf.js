var request=require('request');

module.exports = {
    verbose: true,
    testTimeout: 5 * 60 * 1000,
    plugins: {
        sauce: {
            disabled: true,
            browsers: [
                "Windows 8.1/internet explorer",
                "Windows 7/internet explorer@10",
                "OS X 10.10/chrome",
                "OS X 10.10/firefox",
                "OS X 10.10/safari"
            ],
            'tunnelId': process.env.TRAVIS_JOB_NUMBER
        }
    },
    registerHooks: function(wct) {
         wct.on('browser-end', function(def, error, stats, sessionId, browser) {
            if (!sessionId||!process.env.TRAVIS_COMMIT) return;

            var payload = {
              "name": process.env.TRAVIS_BRANCH+"_"+browser.browserName+"@"+browser.platform,
              "build": process.env.TRAVIS_BUILD_NUMBER*1,
              "public": "shared"
            };
            if (process.env.TRAVIS_TAG)
                payload.tags = [process.env.TRAVIS_TAG];

            wct.emit('log:debug', 'Updating sauce job ', sessionId, payload);

            var username  = process.env.SAUCE_USERNAME;
            var accessKey = process.env.SAUCE_ACCESS_KEY;
            setTimeout(function() {
                request.put({
                  url:  'https://saucelabs.com/rest/v1/' + encodeURIComponent(username) + '/jobs/' + encodeURIComponent(sessionId),
                  auth: {user: username, pass: accessKey},
                  json: true,
                  body: payload
                }).on('response',function(response) {
                    wct.emit('log:debug',
                        'Update complete https://saucelabs.com/rest/v1/' + encodeURIComponent(username) + '/jobs/' + encodeURIComponent(sessionId));
                    wct.emit('log:debug',"Response: "+response.statusCode+" "+response.statusMessage);
                    wct.emit('log:debug', JSON.stringify(response.rawHeaders));
                });
            },500);
          });
    }
};
