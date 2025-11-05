import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import { getHorariosByMedico, deleteHorarioAtencion } from '../services/horarioAtencionService';
import {getMedicos} from '../../medico/services/medicoService';
import '../styles/horario-atencion.css';

const HorarioAtencionList = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [idMedico, setIdMedico] = useState('');
    const [medicos, setMedicos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        const loadMedicos = async () => {
            try {
                const data = await getMedicos();
                setMedicos(data);
                const medicoIdFromState = location.state?.idMedico;
                if (medicoIdFromState) {
                    setIdMedico(medicoIdFromState);
                    // ¡CORRECCIÓN CLAVE! Cargamos automáticamente SOLO si venimos de guardar.
                    if (location.state?.refresh) {
                        fetchHorarios(medicoIdFromState);
                    }
                }
            } catch (err) {
                handleApiError(err, 'Error al cargar la lista de médicos.');
            }
        };
        loadMedicos();
    }, [location.state]); // Se ejecuta si el estado de la navegación cambia

    const fetchHorarios = async (medicoIdToFetch = idMedico) => {
        if (!medicoIdToFetch) return;
        setLoading(true);
        setError(null);
        setSearchPerformed(true); // Marcar que la búsqueda se ha realizado
        try {
            const data = await getHorariosByMedico(medicoIdToFetch);
            setHorarios(data);
        } catch (err) {
            handleApiError(err, 'Error al buscar horarios.');
        } finally {
            setLoading(false);
        }
    };

    const handleApiError = (err, defaultMessage) => {
        const errorMessage = err.response?.data?.error || err.message || defaultMessage;
        setError(errorMessage);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
            setError(null);
            try {
                await deleteHorarioAtencion(id);
                alert('✅ Horario eliminado exitosamente.');
                // Vuelve a cargar los horarios para reflejar el cambio.
                // Esto es más seguro que filtrar el estado local.
                await fetchHorarios();
            } catch (err) {
                // Mejoramos el manejo de errores para ser más específicos,
                // siguiendo el patrón del PLAN_DE_ACCION.md.
                const errorMessage = err.response?.data?.error || 'Error al eliminar el horario.';
                if (err.response?.status === 409) {
                    alert(`⚠️ No se puede eliminar: ${errorMessage}`);
                } else {
                    alert(`❌ ${errorMessage}`);
                }
            }
        }
    };

    return (
        <div className="entity-container">
            <PageHeader title="Horarios de Atención" />

            <div className="entity-header d-flex justify-content-between align-items-end">
                <div className="d-flex flex-column"> 
                    <label className="entity-form-label">Profesional</label>
                    <select
                        className="entity-form-input"
                        value={idMedico}
                        onChange={(e) => {
                            setIdMedico(e.target.value);
                            setError(null);
                        }}
                        style={{ maxWidth: 240 }}
                    >
                        <option value="">Seleccione un profesional</option>
                        {medicos.map((medico) => (
                            <option key={medico.id_medico} value={medico.id_medico}>
                                {`${medico.apellido}, ${medico.nombre}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-flex gap-2"> {/* Quitamos align-items-end, ya que el padre lo maneja */}
                    <button className="btn-entity-primary" onClick={() => fetchHorarios()} disabled={!idMedico || loading}>
                        {loading ? 'Buscando...' : '🔍 Buscar'}
                    </button>
                    {idMedico && (
                        <button className="btn-entity-secondary" onClick={() => navigate('/horario-atencion/nuevo', { state: { idMedico } })}>
                            ➕ Agregar Horario
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="entity-alert entity-alert-danger">Error: {error}</div>}

            {searchPerformed && !loading && horarios?.length === 0 && (
                <div className="entity-alert entity-alert-warning">No hay horarios para mostrar.</div>
            )}

            {horarios?.length > 0 && (
                <div className="table-responsive">
                    <table className="entity-table">
                        <thead>
                            <tr>
                                <th>Día</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th style={{ width: '220px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {horarios.map((h) => (
                                <tr key={h.id_horario}>
                                    <td>{h.dia_semana}</td>
                                    <td>{h.hora_inicio}</td>
                                    <td>{h.hora_fin}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-entity-secondary btn-entity-sm"
                                            onClick={() => navigate(`/horario-atencion/${h.id_horario}/editar`, {
                                                state: { idMedico } // ¡CORRECCIÓN CLAVE! Pasamos el idMedico a la página de edición.
                                            })}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button className="btn-entity-danger btn-entity-sm" onClick={() => handleDelete(h.id_horario)}>
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default HorarioAtencionList;