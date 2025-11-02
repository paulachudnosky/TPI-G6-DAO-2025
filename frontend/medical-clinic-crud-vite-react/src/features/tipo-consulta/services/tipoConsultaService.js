import apiClient from '../../../services/apiClient';

// Backend expone rutas con underscore
const BASE_URL = '/tipos_consulta';

const tipoConsultaService = {
    getAll: async () => {
        const response = await apiClient.get(BASE_URL);
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`${BASE_URL}/${id}`);
        return response.data;
    },
    create: async (tipoConsulta) => {
        const response = await apiClient.post(BASE_URL, tipoConsulta);
        return response.data;
    },
    update: async (id, tipoConsulta) => {
        const response = await apiClient.put(`${BASE_URL}/${id}`, tipoConsulta);
        return response.data;
    },
    remove: async (id) => {
        const response = await apiClient.delete(`${BASE_URL}/${id}`);
        return response.data;
    },
};

export default tipoConsultaService;