// src/api/formApi.js
import axios from 'axios';

const API_BASE = 'https://rpcapplication.aiims.edu/form/api/v1/form';

export const getForm = async (formId) => {
    const res = await axios.get(`${API_BASE}/${formId}`, {
        withCredentials: true, // ✅ uses cookie automatically
      });
    return res.data;
};

export const submitResponse = async (formId, data) => {
    return await axios.post(`${API_BASE}/${formId}/responses`, { data }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    });
};


export async function getResponseById(formId, responseId) {
    const res = await axios.get(`${API_BASE}/${formId}/responses/${responseId}`, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  }