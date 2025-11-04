import apiClient from '../../../services/apiClient';

// URL para operaciones de listado y creación (plural)
const URL_LIST = '/horarios/';
// URL para operaciones sobre un recurso específico (singular)
const URL_RESOURCE = '/horarios/'; 

export const getHorariosByMedico = async (idMedico) => {
    try {
        const response = await apiClient.get(`${URL_LIST}medico/${idMedico}`);
        return response.data;
    } catch (error) {
        // Si el error es un 404, significa que no hay horarios. Devolvemos un array vacío.
        if (error.response && error.response.status === 404) {
            return [];
        }
        // Para otros errores, lo relanzamos.
        throw error;
    }
};

export const getHorarioById = async (id) => {
    const response = await apiClient.get(`${URL_RESOURCE}${id}`);
    return response.data;
};

export const createHorarioAtencion = async (horarioData) => {
    const response = await apiClient.post(URL_LIST, horarioData);
    return response.data;
};

export const updateHorarioAtencion = async (id, horarioData) => {
    // ¡IMPORTANTE! El backend necesita `id_medico` en el cuerpo de la petición PUT
    // para realizar la validación de que no exista otro horario para el mismo médico
    // en el mismo día (excluyendo el que se está editando).
    const response = await apiClient.put(`${URL_RESOURCE}${id}`, horarioData);
    return response.data;
};

export const deleteHorarioAtencion = async (id) => {
    const response = await apiClient.delete(`${URL_RESOURCE}${id}`);
    return response.data;
};