const API_BASE_URL = 'http://localhost:5000/api'; // Base URL for the API

const ENTITY_NAMES = {
    ESPECIALIDAD: 'especialidad',
    HISTORIAL_CLINICO: 'historial_clinico',
    HORARIO_ATENCION: 'horario_atencion',
    MEDICAMENTO: 'medicamento',
    MEDICO: 'medico',
    PACIENTE: 'paciente',
    TIPO_CONSULTA: 'tipo_consulta',
    TIPO_MEDICAMENTO: 'tipo_medicamento',
    TURNO: 'turno',
};

const ROUTES = {
    HOME: '/',
    ESPECIALIDAD: '/especialidad',
    HISTORIAL_CLINICO: '/historial-clinico',
    HORARIO_ATENCION: '/horario-atencion',
    MEDICAMENTO: '/medicamento',
    MEDICO: '/medico',
    PACIENTE: '/paciente',
    TIPO_CONSULTA: '/tipo-consulta',
    TIPO_MEDICAMENTO: '/tipo-medicamento',
    TURNO: '/turno',
};

export { API_BASE_URL, ENTITY_NAMES, ROUTES };