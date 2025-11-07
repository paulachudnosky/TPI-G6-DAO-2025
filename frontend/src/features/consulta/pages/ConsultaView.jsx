import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'; // Importamos useSearchParams
import { getConsultaById } from '../services/consultaService';
import '../styles/consulta.css';

const ConsultaView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams(); // Hook para manejar parámetros de URL
    const idPacienteFromUrl = searchParams.get('idPaciente'); // Obtenemos el idPaciente de la URL

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getConsultaById(id);
                setConsulta(data);
            } catch (error) {
                alert('❌ Error al cargar la consulta');
                navigate(`/historial-clinico${idPacienteFromUrl ? `?idPaciente=${idPacienteFromUrl}` : ''}`); // Volver al historial manteniendo el paciente
            } finally {
                setLoading(false);
            }
        };
        loadData(); // Ejecutamos la carga de datos
    }, [id, navigate, idPacienteFromUrl]); // Agregamos idPacienteFromUrl a las dependencias

    const formatFecha = (fechaISO) => {
        if (!fechaISO) return 'N/A';
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        }) + ' hs';
    };

    if (loading) {
        return <div className="entity-loading">Cargando consulta...</div>;
    }

    if (!consulta) {
        return <div className="entity-alert entity-alert-danger">Consulta no encontrada</div>;
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>👁️ Detalle de la Consulta</h2>
                <button
                    className="btn-entity-secondary"
                    onClick={() => navigate(`/historial-clinico${idPacienteFromUrl ? `?idPaciente=${idPacienteFromUrl}` : ''}`)} // Volver al historial manteniendo el paciente
                >
                    ← Volver al Historial
                </button>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Paciente</h3>
                <p className="consulta-section-content">
                    {consulta.paciente.apellido}, {consulta.paciente.nombre}
                </p>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Médico</h3>
                <p className="consulta-section-content">
                    {consulta.medico.apellido}, {consulta.medico.nombre}
                </p>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Fecha y Hora</h3>
                <p className="consulta-section-content">{formatFecha(consulta.fecha_turno)}</p>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Motivo de la Consulta</h3>
                <p className="consulta-section-content">
                    {consulta.motivo_consulta || <span className="entity-text-muted">N/A</span>}
                </p>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Observaciones del Médico</h3>
                <p className="consulta-section-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {consulta.observaciones || <span className="entity-text-muted">Sin observaciones</span>}
                </p>
            </div>
        </div>
    );
};

export default ConsultaView;