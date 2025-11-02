import apiClient from '../../../services/apiClient';

const RESOURCE = '/especialidades';

// API de Especialidades: export default con métodos estándar
const especialidadService = {
    getAll: async () => (await apiClient.get(RESOURCE)).data,
    getById: async (id) => (await apiClient.get(`${RESOURCE}/${id}`)).data,
    create: async (payload) => (await apiClient.post(RESOURCE, payload)).data,
    update: async (id, payload) => (await apiClient.put(`${RESOURCE}/${id}`, payload)).data,
    remove: async (id) => (await apiClient.delete(`${RESOURCE}/${id}`)).data,
};

export default especialidadService;

// Exports con nombre opcionales (compatibilidad)
export const getEspecialidadById = especialidadService.getById;
export const createEspecialidad = especialidadService.create;
export const updateEspecialidad = especialidadService.update;
export const deleteEspecialidad = especialidadService.remove;