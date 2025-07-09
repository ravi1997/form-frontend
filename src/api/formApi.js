// src/api/formApi.js
import axios from 'axios';
import { getCookie } from '../utils/getCookie';

const API_BASE = 'https://rpcapplication.aiims.edu/form/api/v1/form';

// Get token from cookie and return auth header
function authHeader() {
    const token = getCookie('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET form by ID
export const getForm = async (formId) => {
    try {
        const res = await axios.get(`${API_BASE}/${formId}`, {
            headers: {
                ...authHeader(),
            },
        });
        return res.data;
    } catch (error) {
        console.error('❌ Error fetching form:', error);
        throw error;
    }
};

// POST form response
export const submitResponse = async (formId, data) => {
    try {
        const res = await axios.post(`${API_BASE}/${formId}/responses`, { data }, {
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            },
        });
        return res.data;
    } catch (error) {
        console.error('❌ Error submitting response:', error);
        throw error;
    }
};

// GET specific response by ID
export const getResponseById = async (formId, responseId) => {
    try {
        const res = await axios.get(`${API_BASE}/${formId}/responses/${responseId}`, {
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            },
        });
        return res.data;
    } catch (error) {
        console.error('❌ Error fetching response:', error);
        throw error;
    }
};
