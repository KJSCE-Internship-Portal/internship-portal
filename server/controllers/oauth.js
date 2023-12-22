const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const findPersonBySubId = require('../extras/findPerson');
const handleRefreshLogin = require('../extras/refreshLogin');

const handleLoginRequest = async (req, res) => {
    const redirectUrl = process.env.SERVER_URL +'/api/callback';
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl,
    );
    const cookieCheck = req.cookies;
    if(cookieCheck?.refreshToken){;
        encodedUserInfo = await handleRefreshLogin(cookieCheck.refreshToken);
        const redirectURL = process.env.CLIENT_URL + `/student/home?userInfo=${encodedUserInfo}`;
        res.redirect(redirectURL);
    }
    else{
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            prompt: 'consent',
        });
        res.redirect(authorizeUrl);
    }
}

const callbackCheck = async (req, res) => {
    const code = req.query.code;
    try {
        const redirectUrl = process.env.SERVER_URL +'/api/callback';
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl,
        );
        const tokenResponse = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(tokenResponse.tokens);
        const userCredentials = oAuth2Client.credentials;

        //Access token
        const accessToken = userCredentials.id_token;
        //Refresh Token
        const refreshToken = userCredentials.refresh_token;

        const ticket = await oAuth2Client.verifyIdToken({idToken: accessToken, audience: process.env.CLIENT_ID});
        const payload = ticket.getPayload();

        const sub_id = payload['sub'];
        const name = payload['name'];
        const email = payload['email'];
        const picture = payload['picture'];

        const userInfo = {
            sub_id: sub_id,
            name: name,
            email: email,
            imageUrl: picture,
        }
        res.cookie("refreshToken", refreshToken,{
            path:'/',
            maxAge: 60 * 60 * 24 * 30 * 1000,
            httpOnly: true,
            secure: false,
        });
        const encodedUserInfo = encodeURIComponent(JSON.stringify(userInfo));
        const encodedRefreshToken = encodeURIComponent(refreshToken);
        const redirectURL = process.env.CLIENT_URL + `/student/details?refreshToken=${encodedRefreshToken}&userInfo=${encodedUserInfo}`;
        res.redirect(redirectURL);
        
    } catch (err) {
        console.log('Error in signing in with Google:', err);
        res.status(500).send('Error during authentication');
    }
}

module.exports = {
    handleLoginRequest,
    handleRefreshLogin,
    callbackCheck
};
