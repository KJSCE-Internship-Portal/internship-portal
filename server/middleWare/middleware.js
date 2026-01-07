const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
//this is for the students only
const protect = async (req, res, next) => {
    try {
        const oaccessToken = req.cookies.oaccessToken;
        if (!oaccessToken) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Verifying the JWT token
        const decoded = jwt.verify(oaccessToken, process.env.SECRET_JWT_KEY);
       
        if (decoded) {
            // If the token is valid, attach the user object to the request  
            req.user = decoded;
            return next();
        }else {
            return res.status(401).json({ message: 'Not authorized' });
        }

    } catch (error) {
        // If the error is token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }
        return res.status(401).json({ message: 'Not authorized' });
    }
};
//mentors
const protectStudent = async (req, res, next) => {
    try {
        const oaccessToken = req.cookies.oaccessToken;

        if (!oaccessToken) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Verifying the JWT token
        const decoded = jwt.verify(oaccessToken, process.env.SECRET_JWT_KEY);
       
        if (decoded) {
            // If the token is valid, attach the user object to the reques  
            req.user = decoded;
            if (req.user.role === 'ADMIN'|| req.user.role === 'COORDINATOR'|| req.user.role === 'MENTOR') {
                return next();
            }else {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }else {
            return res.status(401).json({ message: 'Not authorized' });
        }

    } catch (error) {
        // If the error is token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }
        return res.status(401).json({ message: 'Not authorized' });
    }
};
//coordinators
const protectMentor = async (req, res, next) => {
    try {
        const oaccessToken = req.cookies.oaccessToken;

        if (!oaccessToken) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Verifying the JWT token
        const decoded = jwt.verify(oaccessToken, process.env.SECRET_JWT_KEY);
       
        if (decoded) {
            // If the token is valid, attach the user object to the reques  
            req.user = decoded;
            if (req.user.role === 'ADMIN'|| req.user.role === 'COORDINATOR') {
                return next();
            }else {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }else {
            return res.status(401).json({ message: 'Not authorized' });
        }

    } catch (error) {
        // If the error is token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }
        return res.status(401).json({ message: 'Not authorized' });
    }
};
//admin
const protectCoordinator = async (req, res, next) => {
    try {
        const oaccessToken = req.cookies.oaccessToken;

        if (!oaccessToken) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Verifying the JWT token
        const decoded = jwt.verify(oaccessToken, process.env.SECRET_JWT_KEY);
       
        if (decoded) {
            // If the token is valid, attach the user object to the reques  
            req.user = decoded;
            if (req.user.role === 'ADMIN') {
                return next();
            }else {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }else {
            return res.status(401).json({ message: 'Not authorized' });
        }

    } catch (error) {
        // If the error is token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }
        return res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = { protect, protectStudent, protectMentor, protectCoordinator };