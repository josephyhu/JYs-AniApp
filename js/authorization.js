var request = require('request');

var options = {
    uri: 'https://anilist.co/api/v2/oauth/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    json: {
        'grant_type': 'authorization_code',
        'client_id': '6814',
        'client_secret': 'af41U2eAh1v7n7qg0Ng3U8AUVg89cWNoH8wTOBZo',
        'redirect_uri': 'https://anilist.co/api/v2/oauth/pin', // http://example.com/callback
        'code': '{code}'
    }
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body.access_token);
    }
});
