oDesk.js
========

Javascript wrapper for oDesk API

### Installation
```sh
npm install odesk
```

### Using OAuth

Init module
```javascript
odesk.OAuth.init(key, secret);
```

Get request token
```javascript
odesk.OAuth.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
    console.log('error:', error);
    console.log('requestToken:', requestToken);
    console.log('requestTokenSecret:', requestTokenSecret);
    console.log('results:', results);
});
```

Get authenticate url
```javascript
    var url = odesk.OAuth.getAuthenticateUrl(requestToken));
```

Get access token
```javascript
odesk.OAuth.getAccessToken(requestToken, requestTokenSecret, verifier, function (error, accessToken, accessTokenSecret, results) {
    console.log('error:', error);
    console.log('accessToken:', accessToken);
    console.log('accessTokenSecret:', accessTokenSecret);
    console.log('results:', results);

    odesk.OAuth.accessToken = accessToken;
    odesk.OAuth.accessTokenSecret = accessTokenSecret;
```

ODesk API call
```javascript
var params = {
    tq: 'SELECT SUM(hours)',
    tqx: 'out:json'
};

var userUID = 'my_usr_uid';
odesk.get("https://www.odesk.com/gds/timereports/v1/providers/" + userUID, params, function (error, data) {
    console.log('error:', error);
    console.log('data:', data);
  });
```

_For complete workflow see the example file._
