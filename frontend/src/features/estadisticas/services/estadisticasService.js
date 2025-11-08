import apiClient from '../../../services/apiClient';

// Asumimos que los endpoints de estadísticas estarán bajo esta ruta base.
const BASE_URL = '/turnos/estadisticas';

/**
 * Obtiene la cantidad de turnos agrupados por especialidad.
 * Llama a la función: contar_turnos_por_especialidad()
 */
export const getTurnosPorEspecialidad = async () => {
    const response = await apiClient.get(`${BASE_URL}/por_especialidad`);
    return response.data;
};

/**
 * Obtiene la cantidad de turnos por estado (asistidos, cancelados, ausentes).
 * Llama a la función: contar_turnos_por_estado(fecha_inicio, fecha_fin)
 */
export const getEstadoTurnos = async (params) => {
    const response = await apiClient.get(`${BASE_URL}/por_estado`, { params });
    return response.data;
};

/**
 * Obtiene la cantidad de pacientes únicos atendidos por especialidad en un período.
 * Llama a la función: contar_pacientes_atendidos_por_periodo(fecha_inicio, id_especialidad, fecha_fin)
 */
export const getPacientesAtendidos = async (params) => {
    const response = await apiClient.get(`${BASE_URL}/pacientes_atendidos`, { params });
    return response.data;
};

/**
 * Obtiene un listado de turnos por médico en un período.
 * Llama a la función: obtener_turnos_por_periodo(fecha_inicio, fecha_fin, id_medico)
 */
export const getTurnosPorMedicoYPeriodo = async (params) => {
    const response = await apiClient.get(`${BASE_URL}/por_medico_periodo`, { params });
    return response.data;
};