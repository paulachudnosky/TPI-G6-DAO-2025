import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerTurnosPorDia, actualizarEstadoTurno, eliminarTurno, actualizarTurnosVencidos } from '../services/turnoService';
import '../styles/turnos-dia.css';

const TurnosDiaView = () => {
    const { fecha } = useParams();
    const navigate = useNavigate();
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Actualizar turnos vencidos antes de cargar los del día
        actualizarTurnosVencidos().catch(err => console.warn('No se pudieron actualizar turnos vencidos:', err));
        cargarTurnos();
    }, [fecha]);

    const cargarTurnos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerTurnosPorDia(fecha);
            setTurnos(data);
        } catch (err) {
            setError('Error al cargar los turnos del día.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatearFecha = (fecha) => {
        const [anio, mes, dia] = fecha.split('-');
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return `${dia} de ${meses[parseInt(mes) - 1]} de ${anio}`;
    };

    const formatearHora = (fechaHora) => {
        if (!fechaHora) return '';
        try {
            const fecha = new Date(fechaHora);
            return fecha.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (e) {
            return fechaHora;
        }
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

    const handleCambiarEstado = async (idTurno, nuevoEstado) => {
        if (!window.confirm(`¿Cambiar el estado del turno a "${nuevoEstado}"?`)) return;

        try {
            await actualizarEstadoTurno(idTurno, nuevoEstado);
            alert(`✅ Estado actualizado a "${nuevoEstado}"`);
            cargarTurnos();
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al actualizar el estado.';
            alert(`❌ ${errorMessage}`);
        }
    };

    const handleEliminar = async (idTurno) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este turno?')) return;

        try {
            await eliminarTurno(idTurno);
            alert('✅ Turno eliminado exitosamente');
            cargarTurnos();
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al eliminar el turno.';
            alert(`❌ ${errorMessage}`);
        }
    };

    const handleCrearConsulta = (turno) => {
        // Navegar a crear consulta con el ID del turno
        navigate(`/consultas/nueva?id_turno=${turno.id_turno}`);
    };

    const handleVerDetalle = (idTurno) => {
        navigate(`/turnos/${idTurno}`);
    };

    const handleEditar = (idTurno) => {
        navigate(`/turnos/editar/${idTurno}`);
    };

    const esHoy = () => {
        const hoy = new Date().toISOString().split('T')[0];
        return fecha === hoy;
    };

    if (loading) {
        return <div className="entity-loading">Cargando turnos...</div>;
    }

    return (
        <div className="entity-container turnos-dia-container">
            {/* Header */}
            <div className="entity-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>🗓️ Turnos del {formatearFecha(fecha)}</h2>
                    {esHoy() && <span className="badge-dia-actual">Hoy</span>}
                </div>
                <div className="entity-header-actions">
                    <button
                        className="btn-entity-primary"
                        onClick={() => navigate(`/turnos/nuevo?fecha=${fecha}`)}
                    >
                        ➕ Nuevo Turno
                    </button>
                    <button
                        className="btn-entity-secondary"
                        onClick={() => navigate('/turnos')}
                    >
                        📅 Ver Calendario
                    </button>
                </div>
            </div>

            {error && (
                <div className="entity-alert entity-alert-danger">{error}</div>
            )}

            {/* Resumen */}
            <div className="turnos-resumen">
                <div className="resumen-card">
                    <span className="resumen-numero">{turnos.length}</span>
                    <span className="resumen-label">Turnos Totales</span>
                </div>
                <div className="resumen-card">
                    <span className="resumen-numero">
                        {turnos.filter(t => t.estado === 'Programado').length}
                    </span>
                    <span className="resumen-label">Programados</span>
                </div>
                <div className="resumen-card">
                    <span className="resumen-numero">
                        {turnos.filter(t => t.estado === 'Asistido').length}
                    </span>
                    <span className="resumen-label">Asistidos</span>
                </div>
                <div className="resumen-card">
                    <span className="resumen-numero">
                        {turnos.filter(t => t.estado === 'Cancelado').length}
                    </span>
                    <span className="resumen-label">Cancelados</span>
                </div>
            </div>

            {/* Lista de turnos */}
            {turnos.length === 0 ? (
                <div className="empty-state">
                    <p>📭 No hay turnos programados para este día</p>
                    <button
                        className="btn-entity-primary"
                        onClick={() => navigate(`/turnos/nuevo?fecha=${fecha}`)}
                    >
                        Crear Primer Turno
                    </button>
                </div>
            ) : (
                <div className="turnos-lista">
                    {turnos.map(turno => (
                        <div key={turno.id_turno} className="turno-card">
                            {/* Hora */}
                            <div className="turno-hora">
                                <div className="hora-inicio">
                                    {formatearHora(turno.fecha_hora_inicio)}
                                </div>
                                <div className="hora-fin">
                                    {formatearHora(turno.fecha_hora_fin)}
                                </div>
                            </div>

                            {/* Información principal */}
                            <div className="turno-info">
                                <div className="turno-paciente">
                                    <strong>👤 Paciente:</strong>{' '}
                                    {turno.paciente.nombre} {turno.paciente.apellido}
                                    {turno.paciente.dni && (
                                        <span className="turno-dni"> (DNI: {turno.paciente.dni})</span>
                                    )}
                                </div>
                                <div className="turno-medico">
                                    <strong>👨‍⚕️ Médico:</strong>{' '}
                                    Dr/a. {turno.medico.nombre} {turno.medico.apellido}
                                </div>
                                {turno.especialidad_nombre && (
                                    <div className="turno-especialidad">
                                        <strong>🏥 Especialidad:</strong> {turno.especialidad_nombre}
                                    </div>
                                )}
                                {turno.tipo_consulta_nombre && (
                                    <div className="turno-tipo">
                                        <strong>📋 Tipo:</strong> {turno.tipo_consulta_nombre}
                                    </div>
                                )}
                            </div>

                            {/* Estado */}
                            <div className="turno-estado">
                                <span className={`badge-estado ${obtenerClaseEstado(turno.estado)}`}>
                                    {turno.estado}
                                </span>
                            </div>

                            {/* Acciones */}
                            <div className="turno-acciones">
                                <button
                                    className="btn-accion btn-ver"
                                    onClick={() => handleVerDetalle(turno.id_turno)}
                                    title="Ver detalle"
                                >
                                    👁️
                                </button>

                                {turno.estado === 'Programado' && (
                                    <>
                                        <button
                                            className="btn-accion btn-editar"
                                            onClick={() => handleEditar(turno.id_turno)}
                                            title="Editar turno"
                                        >
                                            ✏️
                                        </button>

                                        {esHoy() && (
                                            <button
                                                className="btn-accion btn-consulta"
                                                onClick={() => handleCrearConsulta(turno)}
                                                title="Crear consulta"
                                            >
                                                📝
                                            </button>
                                        )}

                                        <button
                                            className="btn-accion btn-cancelar"
                                            onClick={() => handleCambiarEstado(turno.id_turno, 'Cancelado')}
                                            title="Cancelar turno"
                                        >
                                            ❌
                                        </button>
                                    </>
                                )}

                                {turno.estado === 'Cancelado' && (
                                    <button
                                        className="btn-accion btn-eliminar"
                                        onClick={() => handleEliminar(turno.id_turno)}
                                        title="Eliminar turno"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Acciones del pie */}
            <div className="entity-actions" style={{ marginTop: '1.5rem' }}>
                <button
                    className="btn-entity-secondary"
                    onClick={() => navigate('/turnos/calendario')}
                >
                    ← Volver al Calendario
                </button>
            </div>
        </div>
    );
};

export default TurnosDiaView;
