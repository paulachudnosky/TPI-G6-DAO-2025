import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTurnosPorDia, updateEstadoTurno } from '../services/consultaService';
import '../styles/consulta.css';

const ConsultaAtencion = () => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const cargarTurnos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTurnosPorDia(hoy);
            // Filtramos para mostrar turnos 'Programado' o 'No Asistido'
            const turnosProgramados = data.filter(turno => turno.estado === 'Programado' || turno.estado === 'No Asistido');
            setTurnos(turnosProgramados);
        } catch (err) {
            setError('Error al cargar los turnos de hoy.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [hoy]);

    useEffect(() => {
        cargarTurnos();
    }, [cargarTurnos]);

    const handleAsistido = (turno) => {
        // Redirige al formulario de registro de consulta, pasando el estado del turno
        navigate(`/consulta/registrar`, { state: { turno } });
    };

    const handleNoAsistido = async (idTurno) => {
        const confirmacion = window.confirm(`¿Está seguro que desea marcar el turno como "No Asistido"? Esta acción no se puede deshacer.`);
        if (confirmacion) {
            try {
                await updateEstadoTurno(idTurno, 'No Asistido');
                alert(`✅ Turno marcado como "No Asistido".`);
                // Recargamos la lista para que el turno actualizado desaparezca
                await cargarTurnos();
            } catch (err) {
                alert('❌ Error al actualizar el estado del turno.');
                console.error(err);
            }
        }
    };

    const formatHora = (fechaISO) => {
        if (!fechaISO) return 'N/A';
        const fecha = new Date(fechaISO);
        return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return <div className="entity-loading">Cargando turnos de hoy...</div>;
    }

    if (error) {
        return <div className="entity-alert entity-alert-danger">{error}</div>;
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Atención de Consultas - Hoy ({new Date(hoy).toLocaleDateString('es-AR')})</h2>
                <button
                    className="btn-entity-secondary"
                    onClick={() => navigate('/consultas/historial')}
                >
                    Ver Todas las Consultas
                </button>
            </div>

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>Hora</th>
                            <th>Paciente</th>
                            <th>Médico</th>
                            <th>Tipo de Consulta</th>
                            <th>Estado</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No hay turnos pendientes para hoy.
                                </td>
                            </tr>
                        ) : (
                            turnos.map(turno => (
                                <tr key={turno.id_turno}>
                                    <td>{formatHora(turno.fecha_hora_inicio)}</td>
                                    <td>{turno.paciente_apellido}, {turno.paciente_nombre}</td>
                                    <td>{turno.medico_apellido}, {turno.medico_nombre}</td>
                                    <td>{turno.tipo_consulta_nombre}</td>
                                    <td>
                                        <span className={`status-badge status-${turno.estado.toLowerCase().replace(' ', '-')}`}>
                                            {turno.estado}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        {/* Botón Asistido siempre visible si el turno no está ya 'Asistido' o 'Cancelado' */}
                                        {(turno.estado === 'Programado' || turno.estado === 'No Asistido') && (
                                            <button className="action-button btn-asistido" onClick={() => handleAsistido(turno)}>
                                                <span className="action-button-icon"><span className="icon-check">✓</span></span>
                                                <span className="action-button-text">Asistido</span>
                                            </button>
                                        )}
                                        {/* Botón No Asistido solo visible si el turno está 'Programado' */}
                                        {turno.estado === 'Programado' && (
                                            <button className="action-button btn-no-asistido" onClick={() => handleNoAsistido(turno.id_turno)}>
                                                <span className="action-button-icon"><span className="icon-cross">✗</span></span>
                                                <span className="action-button-text">No Asistido</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsultaAtencion;