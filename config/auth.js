module.exports={
	/*'facebookAuth':{
		'clientID':'221323208421453',
		'clientSecret':'5b59458e65633541db65c9dd9fb22d4a',
		'callbackURL':'https://ikanofi.herokuapp.com/auth/facebook/callback'
	},*/
	'facebookAuth':{
	'clientID': '1643085615774552',
    'clientSecret': 'f3fbc7a2eeda5203977028f6b9dc76b2',
    'callbackURL': "https://localhost:8443/auth/facebook/callback",
    'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API*/
	},
	'googleAuth': {
		'clientID'	:'722869705914-g5rb59il3jomq0vkc03c1ht99au65vtr.apps.googleusercontent.com',
		'clientSecret':'XCXIky_pqCYYYjj7D1hp6lKw',
		'callbackURL': 'http://localhost:3000/auth/google/callback'
	}


	/* 'googleAuth': {
        'clientID': '140013121744-heb7mlvs88n6q0uo3i3subtivmrtqb68.apps.googleusercontent.com',
        'clientSecret': 'WBMr_dnXTL41lP8RpkHzH0IF',
        'callbackURL': 'https://ikanofi.herokuapp.com/auth/google/callback'
    }*/
}