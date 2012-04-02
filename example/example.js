var odesk = require('../odesk.js');

var key = '';
var secret = '';
odesk.OAuth.init(key, secret);

odesk.OAuth.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
    console.log('error:', error);
    console.log('requestToken:', requestToken);
    console.log('requestTokenSecret:', requestTokenSecret);
    console.log('results:', results);

    console.log(odesk.OAuth.getAuthenticateUrl(requestToken));

    ask('verifier', /.+/, function (verifier) {
        console.log('verifier:', verifier);
        odesk.OAuth.getAccessToken(requestToken, requestTokenSecret, verifier, function (error, accessToken, accessTokenSecret, results) {
            console.log('error:', error);
            console.log('accessToken:', accessToken);
            console.log('accessTokenSecret:', accessTokenSecret);
            console.log('results:', results);

            odesk.OAuth.accessToken = accessToken;
            odesk.OAuth.accessTokenSecret = accessTokenSecret;

            odesk.get('https://www.odesk.com/api/auth/v1/info.json', {}, function (error, data) {
                console.log('error:', error);
                console.log('data:', data);
            });
        });
    });
});

function ask(question, format, callback) {
    var stdin = process.stdin, stdout = process.stdout;

    stdin.resume();
    stdout.write(question + ": ");

    stdin.once('data', function (data) {
        data = data.toString().trim();

        if (format.test(data)) {
            callback(data);
        } else {
            stdout.write("It should match: "+ format +"\n");
            ask(question, format, callback);
        }
    });
}
