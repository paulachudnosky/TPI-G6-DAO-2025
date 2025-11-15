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

/**
 * Obtiene todos los turnos de un día específico
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 */
export const obtenerTurnosPorDia = async (fecha) => {
    const response = await apiClient.get(`${TURNOS_API_URL}/dia/${fecha}`);
    return response.data;
};

/**
 * Obtiene un resumen de turnos agrupados por día para un mes específico
 * @param {number} anio - Año
 * @param {number} mes - Mes (1-12)
 */
export const obtenerTurnosMes = async (anio, mes) => {
    const response = await apiClient.get(`${TURNOS_API_URL}/calendario`, {
        params: { anio, mes }
    });
    return response.data;
};

/**
 * Obtiene los turnos de un médico específico
 * @param {number} idMedico - ID del médico
 */
export const obtenerTurnosPorMedico = async (idMedico) => {
    const response = await apiClient.get(`${TURNOS_API_URL}/medico/${idMedico}`);
    return response.data;
};

/**
 * Obtiene los turnos de un médico para un día específico
 * @param {number} idMedico - ID del médico
 * @param {string} fecha - Fecha en formato 'YYYY-MM-DD'
 */
export const obtenerTurnosPorMedicoYDia = async (idMedico, fecha) => {
    const response = await apiClient.get(`${TURNOS_API_URL}/medico/${idMedico}/dia`, {
        params: { fecha }
    });
    return response.data;
};

/**
 * Actualiza solo el estado de un turno
 * @param {number} id - ID del turno
 * @param {string} estado - Nuevo estado ('Programado', 'Asistido', 'No Asistido', 'Cancelado')
 */
export const actualizarEstadoTurno = async (id, estado) => {
    const response = await apiClient.put(`${TURNOS_API_URL}/${id}/estado`, { estado });
    return response.data;
};

/**
 * Valida si un turno corresponde al día actual
 * @param {number} id - ID del turno
 * @returns {Object} { es_dia_actual: boolean, fecha_turno: string }
 */
export const validarTurnoDiaActual = async (id) => {
    const response = await apiClient.get(`${TURNOS_API_URL}/${id}/validar-dia-actual`);
    return response.data;
};

/**
 * Actualiza automáticamente los turnos vencidos a 'No Asistido'
 * @returns {Object} { cantidad_actualizada, mensaje }
 */
export const actualizarTurnosVencidos = async () => {
    const response = await apiClient.post(`${TURNOS_API_URL}/actualizar-vencidos`);
    return response.data;
};

/**
 * Obtiene la lista de turnos vencidos
 * @returns {Object} { cantidad, turnos: [] }
 */
export const obtenerTurnosVencidos = async () => {
    const response = await apiClient.get(`${TURNOS_API_URL}/vencidos`);
    return response.data;
};

/**
 * Obtiene un listado de turnos filtrado por un período y opcionalmente por médico.
 * Utilizado en los reportes de estadísticas.
 * @param {string} fecha_inicio - Fecha de inicio en formato 'YYYY-MM-DD'
 * @param {string} fecha_fin - Fecha de fin en formato 'YYYY-MM-DD'
 * @param {number|null} id_medico - ID del médico (opcional)
 */
export const getTurnosPorPeriodo = async (fecha_inicio, fecha_fin, id_medico) => {
    const response = await apiClient.get('/turnos/estadisticas/por_medico_periodo', {
        params: { fecha_inicio, fecha_fin, id_medico }
    });
    return response.data;
};


// Export nombrado esperado por TurnoList.jsx
export const fetchTurnos = getTurnos;

// Alias para mantener consistencia
export const crearTurno = createTurno;
export const actualizarTurno = updateTurno;
export const eliminarTurno = deleteTurno;
export const obtenerTurnoPorId = getTurnoById;

// Export default de servicio CRUD
const turnoService = {
    getAll: getTurnos,
    getById: getTurnoById,
    create: createTurno,
    update: updateTurno,
    remove: deleteTurno,
    obtenerPorDia: obtenerTurnosPorDia,
    obtenerMes: obtenerTurnosMes,
    obtenerPorMedico: obtenerTurnosPorMedico,
    obtenerPorMedicoYDia: obtenerTurnosPorMedicoYDia,
    actualizarEstado: actualizarEstadoTurno,
    validarDiaActual: validarTurnoDiaActual,
};

export default turnoService;