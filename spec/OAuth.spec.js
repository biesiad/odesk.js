var odesk = require('../odesk.js');
    
describe('odesk.OAuth', function () {
    describe('getAuthenticationUrl', function () {
        it('returns url with oauth token', function () {
            var token = 'token';
            var url = odesk.OAuth.getAuthenticateUrl(token);
            expect(url).toEqual('https://www.odesk.com/services/api/auth?oauth_token=' + token);
        });
    });

    it('requestToken', function() {
        oauth = odesk.OAuth;
        oauth.init('0622686a66d1199525d56cb5a2514d21', 'fd2aa54953f3b0e5');

//         oauth.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
//             console.log('error:', error);
//             console.log('requestToken:', requestToken);
//             console.log('requestTokenSecret:', requestTokenSecret);
//             console.log(results);
// 
//             console.log(oauth.getAuthenticateUrl(requestToken));
// 
//             ask('verifier', /.+/, function (verifier) {
//                 console.log('verifier:', verifier);
//                 oauth.getAccessToken(requestToken, requestTokenSecret, verifier, function (error, accessToken, accessTokenSecret, results) {
//                     console.log('error:', error);
//                     console.log('accessToken:', accessToken);
//                     console.log('accessTokenSecret:', accessTokenSecret);
//                     console.log(results);

                    oauth.accessToken = 'e596e938faddb090be140438a9514ae8';
                    oauth.accessTokenSecret = 'ba781e170f7b575b';

                    oauth.get('https://www.odesk.com/api/auth/v1/info.json', {}, function (error, data) {
                        console.log(arguments);
                    });
//                 });
//             });
//         });
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
