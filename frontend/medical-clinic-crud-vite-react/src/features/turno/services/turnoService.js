import apiClient from '../../../services/apiClient';

const TURNOS_API_URL = '/turnos';

export const getTurnos = async () => {
    const response = await apiClient.get(TURNOS_API_URL);
    return response.data;
};

export const getTurnoById = async (id) => {
    const response = await apiClient.get(`${TURNOS_API_URL}/${id}`);
    return response.data;
};

export const createTurno = async (turnoData) => {
    const response = await apiClient.post(TURNOS_API_URL, turnoData);
    return response.data;
};

export const updateTurno = async (id, turnoData) => {
    const response = await apiClient.put(`${TURNOS_API_URL}/${id}`, turnoData);
    return response.data;
};

export const deleteTurno = async (id) => {
    const response = await apiClient.delete(`${TURNOS_API_URL}/${id}`);
    return response.data;
};

// Export nombrado esperado por TurnoList.jsx
export const fetchTurnos = getTurnos;

// Export default de servicio CRUD
const turnoService = {
    getAll: getTurnos,
    getById: getTurnoById,
    create: createTurno,
    update: updateTurno,
    remove: deleteTurno,
};

export default turnoService;