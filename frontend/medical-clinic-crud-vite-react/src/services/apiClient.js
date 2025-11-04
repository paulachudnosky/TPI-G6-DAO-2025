import axios from 'axios';

// Base URL del backend. No incluir "/api" aquí; los endpoints de features usan "/api/...".
const BASE = ('http://localhost:5000').replace(/\/$/, '');

const apiClient = axios.create({
    baseURL: BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Export por defecto para compatibilidad con imports "default"
export default apiClient;

// Ayudantes genéricos (exports con nombre)
export const get = async (endpoint, config) => {
    const response = await apiClient.get(endpoint, config);
    return response.data;
};

export const post = async (endpoint, data, config) => {
    const response = await apiClient.post(endpoint, data, config);
    return response.data;
};

export const put = async (endpoint, data, config) => {
    const response = await apiClient.put(endpoint, data, config);
    return response.data;
};

export const del = async (endpoint, config) => {
    const response = await apiClient.delete(endpoint, config);
    return response.data;
};