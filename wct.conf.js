var request = require('request');

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
                "OS X 10.10/safari"
            ],
            'tunnelId': process.env.TRAVIS_JOB_NUMBER
        }
    },
    registerHooks: function(wct) {
         wct.on('browser-end', function(def, error, stats, sessionId, browser) {
            if (!sessionId) return;

            if (browser._keepalive) {
              clearInterval(browser._keepalive);
            }

            var payload = {
              "name": process.env.TRAVIS_BRANCH+"_"+process.env.TRAVIS_COMMIT,
              "build": process.env.TRAVIS_BUILD_NUMBER,
              "public": "shared"
            };
            if (process.env.TRAVIS_TAG)
                payload.tag = process.env.TRAVIS_TAG;

            wct.emit('log:debug', 'Updating sauce job', sessionId, payload);

            // Send the pass/fail info to sauce-labs if we are testing remotely.
            var username  = wct.options.plugins.sauce.username;
            var accessKey = wct.options.plugins.sauce.accessKey;
            request.put({
              url:  'https://saucelabs.com/rest/v1/' + encodeURIComponent(username) + '/jobs/' + encodeURIComponent(sessionId),
              auth: {user: username, pass: accessKey},
              json: true,
              body: payload,
            });
          });
    }
};
