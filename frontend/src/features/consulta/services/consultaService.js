import apiClient from '../../../services/apiClient';

const BASE_URL = '/consultas';

// GET ALL (No se usa en esta pantalla, pero es bueno tenerlo)
export const getConsultas = async () => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

// GET BY PACIENTE ID
export const getConsultasPorPaciente = async (idPaciente) => {
    if (!idPaciente) {
        // Evita una llamada a la API si no hay paciente seleccionado
        return [];
    }
    const response = await apiClient.get(`${BASE_URL}/paciente/${idPaciente}`);
    return response.data;
};

// GET ONE BY ID
export const getConsultaById = async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
};