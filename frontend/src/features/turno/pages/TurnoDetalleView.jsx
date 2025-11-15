import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerTurnoPorId } from '../services/turnoService';
import { getPacienteById } from '../../paciente/services/pacienteService';
import { getMedico} from '../../medico/services/medicoService';
import { getEspecialidad} from '../../especialidad/services/especialidadService';
import '../styles/turno-detalle.css';

const TurnoDetalleView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDetalles = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Obtenemos los datos básicos del turno
                const turnoData = await obtenerTurnoPorId(id);
                
                // 2. Enriquecemos la información con llamadas adicionales
                const [pacienteData, medicoData, especialidadData] = await Promise.all([
                    getPacienteById(turnoData.paciente.id_paciente), // Corregido: Acceder al ID desde el objeto anidado
                    getMedico(turnoData.medico.id_medico),           // Corregido: Acceder al ID desde el objeto anidado
                    getEspecialidad(turnoData.id_especialidad)       // Este ID sí está en el nivel superior
                ]);

                // 3. Combinamos todo en un solo objeto de estado
                setDetalle({ ...turnoData, paciente: pacienteData, medico: medicoData, especialidad: especialidadData });
                
            } catch (err) {
                setError('No se pudo cargar la información del turno. Es posible que no exista.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        cargarDetalles();
    }, [id]);

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-AR', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
        });
    };

    const formatearHora = (fechaStr) => {
        if (!fechaStr) return 'N/A';
        const fecha = new Date(fechaStr);
        return fecha.toLocaleTimeString('es-AR', {
            hour: '2-digit', minute: '2-digit', hour12: false
        });
    };

    const obtenerClaseEstado = (estado) => {
        const clases = {
            'Programado': 'estado-programado',
            'Asistido': 'estado-asistido',
            'No Asistido': 'estado-no-asistido',
            'Cancelado': 'estado-cancelado'
        };
        return clases[estado] || '';
    };

    if (loading) {
        return <div className="entity-loading">Cargando detalle del turno...</div>;
    }

    return (
        <div className="entity-container turno-detalle-container">
            <div className="entity-header">
                <h2>👁️ Detalle del Turno</h2>
                <div className="entity-header-actions">
                    <button className="btn-entity-secondary" onClick={() => navigate(-1)}>
                        ← Volver
                    </button>
                </div>
            </div>

            {error && <div className="entity-alert entity-alert-danger">{error}</div>}

            {detalle && (
                <div className="detalle-grid">
                    {/* Tarjeta de Detalles del Turno */}
                    <div className="detalle-card">
                        <h3 className="detalle-card-header">🗓️ Datos del Turno</h3>
                        <div className="detalle-card-body">
                            <div className="detalle-item"><span>Fecha:</span><strong>{formatearFecha(detalle.fecha_hora_inicio)}</strong></div>
                            <div className="detalle-item"><span>Hora Inicio:</span><strong>{formatearHora(detalle.fecha_hora_inicio)}</strong></div>
                            <div className="detalle-item"><span>Hora Fin:</span><strong>{formatearHora(detalle.fecha_hora_fin)}</strong></div>
                            <div className="detalle-item"><span>Especialidad:</span><strong>{detalle.especialidad?.nombre || 'No especificada'}</strong></div>
                            <div className="detalle-item"><span>Tipo de Consulta:</span><strong>{detalle.tipo_consulta?.nombre || 'No especificado'}</strong></div>
                            <div className="detalle-item">
                                <span>Estado:</span>
                                <span className={`badge-estado ${obtenerClaseEstado(detalle.estado)}`}>
                                    {detalle.estado}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Información del Paciente (usando el objeto anidado) */}
                    <div className="detalle-card">
                        <h3 className="detalle-card-header">👤 Paciente</h3>
                        <div className="detalle-card-body">
                            <div className="detalle-item"><span>Nombre:</span><strong>{detalle.paciente?.nombre} {detalle.paciente?.apellido}</strong></div>
                            <div className="detalle-item"><span>DNI:</span><strong>{detalle.paciente?.dni}</strong></div>
                            <div className="detalle-item"><span>Email:</span><strong>{detalle.paciente?.email || 'No disponible'}</strong></div>
                            <div className="detalle-item"><span>Teléfono:</span><strong>{detalle.paciente?.telefono}</strong></div>
                        </div>
                    </div>

                    {/* Tarjeta de Información del Médico (usando el objeto anidado) */}
                    <div className="detalle-card">
                        <h3 className="detalle-card-header">👨‍⚕️ Médico</h3>
                        <div className="detalle-card-body">
                            <div className="detalle-item"><span>Nombre:</span><strong>Dr/a. {detalle.medico?.nombre} {detalle.medico?.apellido}</strong></div>
                            <div className="detalle-item"><span>Especialidad Principal:</span><strong>{detalle.medico?.especialidad_nombre || 'No disponible'}</strong></div>
                            <div className="detalle-item"><span>Email:</span><strong>{detalle.medico?.email || 'No disponible'}</strong></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TurnoDetalleView;