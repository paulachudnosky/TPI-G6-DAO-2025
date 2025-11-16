import apiClient from '../../../services/apiClient';

const ESPECIALIDAD_BASE_URL = '/especialidades';

export const getEspecialidades = async (incluirInactivos = false) => {
    // Llama a GET /especialidades o GET /especialidades?incluir_inactivos=true
    const params = {
        incluir_inactivos: incluirInactivos
    };
    const response = await apiClient.get(ESPECIALIDAD_BASE_URL, { params });
    return response.data;
};

export const getEspecialidad = async (id) => {
    const response = await apiClient.get(`${ESPECIALIDAD_BASE_URL}/${id}`);
    return response.data;
};

export const createEspecialidad = async (especialidadData) => {
    const response = await apiClient.post(ESPECIALIDAD_BASE_URL, especialidadData);
    return response.data;
};

export const updateEspecialidad = async (id, especialidadData) => {
    const response = await apiClient.put(`${ESPECIALIDAD_BASE_URL}/${id}`, especialidadData);
    return response.data;
};

// La baja lógica se maneja a través de updateEspecialidad, cambiando el campo 'activo'.
// La función deleteEspecialidad se mantiene por si se necesita para borrado físico en el futuro,
// pero no se usará para la baja lógica.
export const deleteEspecialidad = async (id) =>
  apiClient.delete(`${ESPECIALIDAD_BASE_URL}/${id}`);
