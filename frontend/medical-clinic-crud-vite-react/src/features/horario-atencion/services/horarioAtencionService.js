import apiClient from '../../../services/apiClient';

// Consulta por médico: /horarios_medico/:idMedico
const horarioAtencionService = {
    getByMedico: async (idMedico) => {
        const response = await apiClient.get(`/horarios_medico/${idMedico}`);
        return response.data;
    },
};

export default horarioAtencionService;