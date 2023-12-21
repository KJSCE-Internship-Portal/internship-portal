const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const findPersonBySubId = require('../extras/findPerson');

const handleLoginRequest = async (req, res) => {
    const redirectUrl = 'http://localhost:5000/api/callback';
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl,
    );
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        prompt: 'consent',
    });
    res.json({url:authorizeUrl});
}

const callbackCheck = async (req, res) => {
    const code = req.query.code;
    try {
        const redirectUrl = 'http://localhost:5000/api/callback';
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
        // const newTokenResponse = await oAuth2Client.refreshToken(refreshToken);

        const ticket = await oAuth2Client.verifyIdToken({idToken: accessToken, audience: process.env.CLIENT_ID});
        const payload = ticket.getPayload();
        console.log('Payload retrieved:', payload)

        const sub_id = payload['sub'];
        const name = payload['name'];
        const email = payload['email'];
        const picture = payload['picture'];

        const userInfo = {
            sub_id: sub_id,
            name: name,
            email: email,
            picture: picture,
            refreshToken,
            accessToken
        }
        //db check
        // res.cookie("refresh", refreshToken,{
        //     path:'/',
        //     maxAge: 60 * 60 * 24 * 1000,
        //     httpOnly: true,
        //     secure: true,
        //     sameSite:'strict'
        // });

        // console.log(req.cookies.jwt);

        res.status(200).send(userInfo);
        
    } catch (err) {
        console.log('Error in signing in with Google:', err);
        res.status(500).send('Error during authentication');
    }
}

module.exports = {
    handleLoginRequest,
    callbackCheck
};
