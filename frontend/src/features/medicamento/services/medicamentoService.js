import apiClient from '../../../services/apiClient';

const BASE_URL = '/medicamentos';

export const getMedicamentos = async () => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

export const getMedicamentoById = async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createMedicamento = async (medicamento) => {
    const response = await apiClient.post(BASE_URL, medicamento);
    return response.data;
};

export const updateMedicamento = async (id, medicamento) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, medicamento);
    return response.data;
};

export const deleteMedicamento = async (id) => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};

// Export default para consumir como servicio
const medicamentoService = {
    getAll: getMedicamentos,
    getById: getMedicamentoById,
    create: createMedicamento,
    update: updateMedicamento,
    remove: deleteMedicamento,
};

export default medicamentoService;