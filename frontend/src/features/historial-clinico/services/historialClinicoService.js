import apiClient from '../../../services/apiClient';

const BASE_URL = '/historial_clinico';

export const getHistorialClinicoList = async () => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

export const getHistorialClinicoById = async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createHistorialClinico = async (data) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
};

export const updateHistorialClinico = async (id, data) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteHistorialClinico = async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
};

// Export default para uso como servicio
const historialClinicoService = {
    getAll: getHistorialClinicoList,
    getById: getHistorialClinicoById,
    create: createHistorialClinico,
    update: updateHistorialClinico,
    remove: deleteHistorialClinico,
};

export default historialClinicoService;