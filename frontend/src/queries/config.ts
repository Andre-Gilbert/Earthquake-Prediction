import axios from 'axios';

const USGS_EARTHQUAKE_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1';
const EARTHQUAKE_API_URL = '';
const EARTHQUAKE_API_KEY = '';

export const usgsInstance = axios.create({
    baseURL: USGS_EARTHQUAKE_API_URL,
});

export const apiInstance = axios.create({ baseURL: EARTHQUAKE_API_URL });
