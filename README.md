oDesk.js
========

Javascript wrapper for oDesk API


Usage
-----

### Authentication 
(for non-web based applications)


Init module:

    oDesk.Authentication.init(api_key, api_secret);


Get *frob*:

    oDesk.Authentication.getFrob(function (data) {
      console.log(data.frob);
    });


Send user to oDesk app authorization url:

    var url = oDesk.Authentication.authorizeUrl(frob);
    window.location.href = url;


Wait for user to come back, and get *token*:

    oDesk.Authentication.getToken(frob, function (data) {
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
    
    oDesk.Data.getSigned("https://www.odesk.com/gds/timereports/v1/providers/" + provider_id, params, function (data) {
          console.log(data.table);
    });
