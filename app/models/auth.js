module.exports = {

    'facebookAuth' : {
        'clientID'      : '221323208421453', // your App ID
        'clientSecret'  : '5b59458e65633541db65c9dd9fb22d4a', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
     }
    };