import apiClient from '../../../services/apiClient';

// URL base para el recurso de pacientes.
// ¡IMPORTANTE! No debe tener una barra al final ("/") para que coincida con el backend.
const URL_RESOURCE = '/pacientes';

export const getPacientes = async (incluirInactivos = false) => {
    // Llama a GET /pacientes o GET /pacientes?incluir_inactivos=true
    const params = {
        incluir_inactivos: incluirInactivos
    };
    const response = await apiClient.get(URL_RESOURCE, { params });
    return response.data;
};

export const getPacienteById = async (id) => {
    // Llama a GET /pacientes/{id}
    const response = await apiClient.get(`${URL_RESOURCE}/${id}`);
    return response.data;
};

export const createPaciente = async (pacienteData) => {
    // Llama a POST /pacientes
    const response = await apiClient.post(URL_RESOURCE, pacienteData);
    return response.data;
};

export const updatePaciente = async (id, pacienteData) => {
    // Llama a PUT /pacientes/{id}
    const response = await apiClient.put(`${URL_RESOURCE}/${id}`, pacienteData);
    return response.data;
};

export const deletePaciente = async (id) => {
    // Llama a DELETE /pacientes/{id}
    const response = await apiClient.delete(`${URL_RESOURCE}/${id}`);
    return response.data;
};