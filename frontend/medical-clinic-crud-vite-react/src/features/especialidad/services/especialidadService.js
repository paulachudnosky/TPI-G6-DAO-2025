import apiClient from '../../../services/apiClient';

const ESPECIALIDAD_BASE_URL = '/especialidades';

export const getEspecialidades = async () => {
    const response = await apiClient.get(ESPECIALIDAD_BASE_URL);
    return response.data;
};

export const getEspecialidad = async (id) => {
    const response = await apiClient.get(`${ESPECIALIDAD_BASE_URL}/${id}`);
    return response.data;
};

export const createEspecialidad = async (especialidadData) => {
    const response = await apiClient.post(ESPECIALIDAD_BASE_URL, especialidadData);
    return response.data;
};

export const updateEspecialidad = async (id, especialidadData) => {
    const response = await apiClient.put(`${ESPECIALIDAD_BASE_URL}/${id}`, especialidadData);
    return response.data;
};

export const deleteEspecialidad = async (id) => {
    const response = await apiClient.delete(`${ESPECIALIDAD_BASE_URL}/${id}`);
    return response.data;
};
