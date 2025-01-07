const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const findPersonBySubId = require('../extras/findPerson');
const handleRefreshLogin = require('../extras/refreshLogin');
const { findOneAndUpdate } = require('../models/coordinator');
const Student = require("../models/student");
const Mentor = require("../models/mentor");
const Coordinator = require('../models/coordinator');
const Admin = require("../models/admin");

const handleLoginRequest = async (req, res) => {
    try {
        const redirectUrl = process.env.SERVER_URL + '/api/callback';
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl,
        );

        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            const accessToken = await handleRefreshLogin(refreshToken);
            const redirectURL = `${process.env.CLIENT_URL}/redirection/${accessToken}`;
            return res.redirect(redirectURL);
        }

        const authUrlOptions = {
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            prompt: 'consent',
        };

        const authorizeUrl = oAuth2Client.generateAuthUrl(authUrlOptions);
        return res.redirect(authorizeUrl);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const callbackCheck = async (req, res) => {
    const code = req.query.code;
    const error = req.query.error; // Google returns an error if login is canceled

    if (error) {
        // Handle login cancellation by redirecting back to the frontend login page
        console.log('User cancelled login or error occurred:', error);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=canceled`);
    }

    try {
        const redirectUrl = process.env.SERVER_URL + '/api/callback';
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl,
        );

        const tokenResponse = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(tokenResponse.tokens);
        const userCredentials = oAuth2Client.credentials;

        const accessToken = userCredentials.id_token;
        const refreshToken = userCredentials.refresh_token;

        const ticket = await oAuth2Client.verifyIdToken({ idToken: accessToken, audience: process.env.CLIENT_ID });
        const payload = ticket.getPayload();

        const sub_id = payload['sub'];
        const name = payload['name'];
        const email = payload['email'];
        const picture = payload['picture'];

        const found = await findPersonBySubId(email);

        if (found) {
            if (found._doc.isApproved && found._doc.isActive) {
                var updatedUser = await Student.findOneAndUpdate(
                    {email},
                    { $set: {
                        'sub_id': sub_id,
                        'profile_picture_url': picture,
                    },},
                    {new: true,}
                );
                if(!updatedUser){
                    updatedUser = await Mentor.findOneAndUpdate(
                        {
                        email
                        },
                        {
                        $set: {
                            'sub_id': sub_id,
                            'profile_picture_url': picture,
                        },
                        },
                        {
                        new: true,
                        }
                    );
                }
                if(!updatedUser){
                    updatedUser = await Coordinator.findOneAndUpdate(
                        {
                        email
                        },
                        {
                        $set: {
                            'sub_id': sub_id,
                            'profile_picture_url': picture,
                        },
                        },
                        {
                        new: true,
                        }
                    );
                }
                if(!updatedUser){
                    updatedUser = await Admin.findOneAndUpdate(
                        {
                        email
                        },
                        {
                        $set: {
                            'sub_id': sub_id,
                            'profile_picture_url': picture,
                        },
                        },
                        {
                        new: true,
                        }
                    );
                }
                if(!updatedUser){
                    const redirectURL = `${process.env.CLIENT_URL}/login`;
                    return res.redirect(redirectURL);
                }
                res.cookie("refreshToken", refreshToken, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                    httpOnly: true,
                    secure: false,
                    overwrite: true,
                });

                const redirectURL = `${process.env.CLIENT_URL}/redirection/${accessToken}`;
                return res.redirect(redirectURL);

            } else {
                return res.redirect(`${process.env.CLIENT_URL}/error`);
            }
        }
        else {
            const userInfo = {
                sub_id: sub_id,
                name: name,
                email: email,
                imageUrl: picture,
            }
            const encodedUserInfo = encodeURIComponent(JSON.stringify(userInfo));
            const redirectURL = process.env.CLIENT_URL + `/student/details?userInfo=${encodedUserInfo}`;
            res.redirect(redirectURL);
        }

    } catch (err) {
        console.log('Error during Google callback:', err);
        return res.status(500).send('Error during authentication');
    }
};


const getUserWithAccessToken = async (req, res) => {

    try {
        const accessToken = req.body.accessToken;
        const redirectUrl = process.env.SERVER_URL + '/api/callback';
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl,
        );
        const ticket = await oAuth2Client.verifyIdToken({ idToken: accessToken, audience: process.env.CLIENT_ID });
        const payload = ticket.getPayload();
        // console.log(payload);

        const currentTimestamp = Date.now(); // current timestamp in milliseconds
        const givenTimestampInSeconds = payload.exp; // the timestamp to compare in seconds
        const givenTimestampInMilliseconds = givenTimestampInSeconds * 1000; // Convert given timestamp to milliseconds

        if (currentTimestamp > givenTimestampInMilliseconds) {
            return res.status(500).json({ success: false, msg: "Your Session Has Expired" });
        }

        const sub_id = payload['sub'];
        const email = payload['email'];
        const user = await findPersonBySubId(email);

        if (!user) {
            return res.status(200).json({ success: false, msg: `User Doesn't Exist` });
        }

        const flag = user._doc.isActive;
        if (!flag){
            return res.status(500).json({ success: false, msg: "Account is Deactivated" });
        }

        return res.status(200).json({ success: true, msg: user });

    } catch (error) {
        console.log(`${error.message} (error)`.red);
        return res.status(500).json({ success: false, msg: error.message });
    }
}

const logoutUser = async (req, res) => {

    try {
        res.cookie('refreshToken', '', {
            path: '/',
            maxAge: 0,
            httpOnly: true,
            secure: false,
            overwrite: true
        });
        res.redirect(process.env.CLIENT_URL + '/login');    

    } catch (error) {
        console.log(`${error.message} (error)`.red);
        return res.status(500).json({ success: false, msg: error.message });
    }

};



module.exports = {
    handleLoginRequest,
    handleRefreshLogin,
    callbackCheck,
    getUserWithAccessToken,
    logoutUser
};
