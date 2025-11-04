// src/features/tipo-medicamento/services/tipoMedicamentoService.js
import apiClient from '../../../services/apiClient';

// Backend expone plural con underscore
const BASE_URL = '/tipos_medicamento';

const tipoMedicamentoService = {
    getAll: async () => {
        const response = await apiClient.get(BASE_URL);
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    },
    create: async (tipoMedicamento) => {
        const response = await apiClient.post(BASE_URL, tipoMedicamento);
        return response.data;
    },
    update: async (id, tipoMedicamento) => {
        const response = await apiClient.put(`${BASE_URL}/${id}`, tipoMedicamento);
        return response.data;
    },
    remove: async (id) => {
        const response = await apiClient.delete(`${BASE_URL}/${id}`);
        return response.data;
    },
};

export default tipoMedicamentoService;