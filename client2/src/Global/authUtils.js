import axios from 'axios'
import { url } from './URL';

export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

export const logout = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
}


export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};


export const isAuthenticated = () => {
    const token = getAuthToken();
    // return token !== null; 
    return true
};


export const getUserDetails = async () => {
    const token = getAuthToken();

    if (!token) {
        return false;
    }

    try {
        const response = await axios.post(url + '/authorization', { authorization: token }
            // {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            //     'Content-Type': 'application/json',
            // },
            // }
        );

        if (response.status === 200) {
            const userDetails = response.data;
            return userDetails.message;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        return false;
    }
};


