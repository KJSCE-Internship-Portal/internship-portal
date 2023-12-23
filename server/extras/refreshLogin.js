const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();
const findPersonBySubId = require('../extras/findPerson');


async function handleRefreshLogin(refreshToken) {
    try{
        const redirectUrl = 'http://localhost:5000/api/callback';
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl,
        );
        const newTokenResponse = await oAuth2Client.refreshToken(refreshToken);
        const newAccessToken = newTokenResponse.tokens.id_token

        return newAccessToken;
        
        const ticket = await oAuth2Client.verifyIdToken({idToken: newAccessToken, audience: process.env.CLIENT_ID});
        const payload = ticket.getPayload();
        
        const sub_id = payload['sub'];
        const email = payload['email'];

        const userInfo = {
            sub_id: sub_id,
            email: email,
        }

        const user = await findPersonBySubId(email);
        console.log(user);
        if (user){
            return encodeURIComponent(JSON.stringify(user));
        } else{
            return "404 Not Found";
        }

        
    } catch (err) {
        console.log('Error in signing in with Google:', err);
        return err;
    }
}

module.exports = handleRefreshLogin