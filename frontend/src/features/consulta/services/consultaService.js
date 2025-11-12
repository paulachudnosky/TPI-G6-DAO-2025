import apiClient from '../../../services/apiClient';

const BASE_URL = '/consultas';
const TURNOS_URL = '/turnos'; // URL para operaciones de turnos

// GET ALL
export const getConsultas = async () => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

// GET BY PACIENTE ID
export const getConsultasPorPaciente = async (idPaciente) => {
    const response = await apiClient.get(`${BASE_URL}/paciente/${idPaciente}`);
    return response.data;
};

// GET ONE BY ID
export const getConsultaById = async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
};

// GET turnos por día
export const getTurnosPorDia = async (fecha) => {
    const response = await apiClient.get(`${TURNOS_URL}/dia/${fecha}`);
    return response.data;
};

// UPDATE estado de un turno
export const updateEstadoTurno = async (idTurno, nuevoEstado) => {
    const response = await apiClient.put(`${TURNOS_URL}/${idTurno}/estado`, { estado: nuevoEstado });
    return response.data;
};

// POST para registrar una consulta completa (consulta + receta)
export const registrarConsultaCompleta = async (datosConsulta) => {
    const response = await apiClient.post(`${BASE_URL}/registrar-completa`, datosConsulta);
    return response.data;
};

// GET consultas por día
export const getConsultasPorDia = async (fecha) => {
    const response = await apiClient.get(`${BASE_URL}/dia/${fecha}`);
    return response.data;
};

// GET receta de una consulta
export const getRecetaPorConsulta = async (idConsulta) => {
    const response = await apiClient.get(`${BASE_URL}/${idConsulta}/receta`);
    return response.data;
};