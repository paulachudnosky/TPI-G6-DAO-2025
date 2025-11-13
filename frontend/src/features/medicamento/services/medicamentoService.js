import apiClient from '../../../services/apiClient'; // Asegúrate que esta ruta sea correcta

const MEDICAMENTO_BASE_URL = '/medicamentos/';

export const getMedicamentos = async () => {
    const response = await apiClient.get(MEDICAMENTO_BASE_URL);
    return response.data;
};

export const getMedicamento = async (id) => {
    const response = await apiClient.get(`${MEDICAMENTO_BASE_URL}${id}`);
    return response.data;
};

export const createMedicamento = async (medicamentoData) => {
    const response = await apiClient.post(MEDICAMENTO_BASE_URL, medicamentoData);
    return response.data;
};

export const updateMedicamento = async (id, medicamentoData) => {
    const response = await apiClient.put(`${MEDICAMENTO_BASE_URL}${id}`, medicamentoData);
    return response.data;
};

export const deleteMedicamento = async (id) => {
    const response = await apiClient.delete(`${MEDICAMENTO_BASE_URL}${id}`);
    return response.data;
};