import apiClient from '../../../services/apiClient';

const PACIENTE_API_URL = '/pacientes';

export const getPacientes = async () => {
    const response = await apiClient.get(PACIENTE_API_URL);
    return response.data;
};

export const getPacienteById = async (id) => {
    const response = await apiClient.get(`${PACIENTE_API_URL}/${id}`);
    return response.data;
};

export const createPaciente = async (pacienteData) => {
    const response = await apiClient.post(PACIENTE_API_URL, pacienteData);
    return response.data;
};

export const updatePaciente = async (id, pacienteData) => {
    const response = await apiClient.put(`${PACIENTE_API_URL}/${id}`, pacienteData);
    return response.data;
};

export const deletePaciente = async (id) => {
    await apiClient.delete(`${PACIENTE_API_URL}/${id}`);
};

// Export default para consumir como servicio
const pacienteService = {
    getAll: getPacientes,
    getById: getPacienteById,
    create: createPaciente,
    update: updatePaciente,
    remove: deletePaciente,
};

export default pacienteService;