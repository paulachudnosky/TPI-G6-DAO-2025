import apiClient from '../../../services/apiClient';

const MEDICO_BASE_URL = '/medicos';

export const getMedicos = async () => {
    const response = await apiClient.get(MEDICO_BASE_URL);
    return response.data;
};

// Nueva función para obtener solo médicos activos (para selectores y listas)
export const getMedicosActivos = async () => {
    const response = await apiClient.get(`${MEDICO_BASE_URL}?activo=true`);
    return response.data;
};

export const getMedico = async (id) => {
    const response = await apiClient.get(`${MEDICO_BASE_URL}/${id}`);
    return response.data;
};

// Hace una petición HTTP POST a: http://localhost:5000/medicos
export const createMedico = async (medicoData) => {
    const response = await apiClient.post(MEDICO_BASE_URL, medicoData);
    return response.data;
};

export const updateMedico = async (id, medicoData) => {
    const response = await apiClient.put(`${MEDICO_BASE_URL}/${id}`, medicoData);
    return response.data;
};

export const deleteMedico = async (id) => {
    const response = await apiClient.delete(`${MEDICO_BASE_URL}/${id}`);
    return response.data;
};

// Nueva función para baja/alta lógica
export const setMedicoStatus = async (id, activo) => {
    const response = await apiClient.patch(`${MEDICO_BASE_URL}/${id}`, { activo });
    return response.data;
};
