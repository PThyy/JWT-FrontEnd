import axios from 'axios';
import { toast } from "react-toastify";
require('dotenv').config();
// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
});

instance.defaults.withCredentials = true;

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${localStorage.getItem("jwt")}`;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error && error.response && error.request.status || 500;
    switch (status) {
        // authentication (token related issues)
        case 401: {
            if (window.location.pathname !== '/' &&
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/register'
            ) {
                toast.error('Unauthorized user. Please login...');
            }
            return error.response.data;
        }

        // forbidden (permission related issues)
        case 403: {
            toast.error(`You don't have permission to access this resource...`);
            return Promise.reject(error);
        }

        case 400: {
            return Promise.reject(error);
        }

        default: {
            return Promise.reject(error);
        }
    }
});

export default instance;