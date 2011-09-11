oDesk.js
========

Javascript wrapper for oDesk API


Usage
-----

### Auth 
(for non-web based applications)


Init module:

    oDesk.Auth.init(api_key, api_secret);


Get *frob*:

    oDesk.Auth.getFrob(function (data) {
        console.log(data.frob);
    });


Send user to oDesk app authorization url:

    var url = oDesk.Auth.getAuthorizatonUrl(frob);
    window.location.href = url;


Wait for user to come back, and get *token*:

    oDesk.Auth.getToken(frob, function (data) {
        console.log(data.token);
    });
    

### Data

Init module first:

    oDesk.Data.init({ 
        key: 'api key', 
        secret: 'api secret', 
        frob: 'frob', 
        token: 'token' 
    });
    

Get data from oDesk:

    var provider_id = "myID",
        params = {
            tq: "SELECT worked_on, assignment_team_id, hours, task, memo WHERE worked_on > '2009-10-01' AND worked_on <= '2009-10-31'",
            tqx: "out:json"
        };
    
    oDesk.Data.get("https://www.odesk.com/gds/timereports/v1/providers/" + provider_id, params, function (data) {
          console.log(data.table);
    });
