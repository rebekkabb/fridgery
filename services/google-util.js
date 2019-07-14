const google = require('googleapis').google;

const googleConfig = {
    clientId: process.env.OAUTH2_CLIENT_ID,
    clientSecret: process.env.OAUTH2_CLIENT_SECRET,
    redirect: process.env.OAUTH2_CALLBACK
};

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.email',
];

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: defaultScope,
        clientId: googleConfig.clientId,
        redirect_uri: googleConfig.redirect
    });
}

function urlGoogle() {
    const auth = createConnection();
    return getConnectionUrl(auth);
}

/**
 * Extract the email and id of the google account from the "code" parameter.
 */
async function getGoogleAccountFromCode(code) {
    const auth = createConnection();
    const data = await auth.getToken(code);
    const tokens = data.tokens;

    auth.setCredentials(tokens);

    const clientData = await google.oauth2('v2').userinfo.get({auth: auth});

    return {
        id: clientData.data.id,
        email: clientData.data.email,
        picture: clientData.data.picture,
    };
}

module.exports = {
    urlGoogle: urlGoogle,
    getGoogleAccountFromCode: getGoogleAccountFromCode
};
