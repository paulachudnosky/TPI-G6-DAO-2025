import React, { useState, useEffect, useCallback } from 'react';
import { getConsultasPorDia, getRecetaPorConsulta } from '../services/consultaService';
import RecetaMedica from '../components/RecetaMedica'; // Importamos el nuevo componente de receta
import '../styles/consulta.css';

const ConsultaList = () => {
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
    const [consultaSeleccionada, setConsultaSeleccionada] = useState(null); // Guardamos la consulta completa
    const [loadingReceta, setLoadingReceta] = useState(false);

    const cargarConsultas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getConsultasPorDia(fecha);
            setConsultas(data);
        } catch (err) {
            setError('Error al cargar las consultas para la fecha seleccionada.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [fecha]);

    useEffect(() => {
        cargarConsultas();
    }, [cargarConsultas]);

    const handleFechaChange = (e) => {
        setFecha(e.target.value);
    };

    const handleVerReceta = async (consulta) => {
        setLoadingReceta(true);
        setConsultaSeleccionada(consulta); // Guardamos la consulta para usar sus datos
        try {
            const dataReceta = await getRecetaPorConsulta(consulta.id_consulta);
            setRecetaSeleccionada(dataReceta);
        } catch (err) {
            alert('Error al cargar la receta.');
            console.error(err);
        } finally {
            setLoadingReceta(false);
        }
    };

    const closeModal = () => {
        setRecetaSeleccionada(null);
        setConsultaSeleccionada(null);
    };

    const formatHora = (fechaISO) => {
        if (!fechaISO) return 'N/A';
        return new Date(fechaISO).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Consultas Realizadas por Día</h2>
                <div className="entity-form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="fecha-consulta" className="entity-form-label">Seleccionar Fecha</label>
                    <input
                        type="date"
                        id="fecha-consulta"
                        className="entity-form-input"
                        value={fecha}
                        onChange={handleFechaChange}
                    />
                </div>
            </div>

            {error && <div className="entity-alert entity-alert-danger">{error}</div>}

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>Hora</th>
                            <th>Paciente</th>
                            <th>Médico</th>
                            <th>Motivo de la Consulta</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="entity-loading">Cargando...</td></tr>
                        ) : consultas.length === 0 ? (
                            <tr><td colSpan="5" className="empty-state">No hay consultas registradas para esta fecha.</td></tr>
                        ) : (
                            consultas.map(c => (
                                <tr key={c.id_consulta}>
                                    <td>{formatHora(c.fecha_turno)}</td>
                                    <td>{c.paciente.apellido}, {c.paciente.nombre}</td>
                                    <td>{c.medico.apellido}, {c.medico.nombre}</td>
                                    <td>{c.motivo_consulta || <span className="entity-text-muted">N/A</span>}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-entity-primary btn-entity-sm"
                                            onClick={() => handleVerReceta(c)}
                                            disabled={loadingReceta}
                                        >
                                            Ver Receta
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para ver la receta */}
            {recetaSeleccionada && consultaSeleccionada && (
                <div className="modal-overlay" onClick={closeModal}>
                    {/* El contenido del modal ahora es directamente el componente de la receta */}
                    <div className="modal-content-receta" onClick={e => e.stopPropagation()}>
                        <button onClick={closeModal} className="modal-close-btn-receta">&times;</button>
                            <RecetaMedica
                                fechaEmision={new Date(recetaSeleccionada.fecha_emision).toLocaleDateString('es-AR')}
                                numeroRecetario={recetaSeleccionada.id_receta}
                                obraSocial="JERARQUICOS SALUD" // Placeholder
                                numeroAfiliado={`${consultaSeleccionada.paciente.dni}/00`} // Placeholder
                                dniPaciente={consultaSeleccionada.paciente.dni}
                                diagnostico={consultaSeleccionada.motivo_consulta}
                                plan="PLAN 310" // Placeholder
                                medicamentos={recetaSeleccionada.medicamentos.map(m => ({ ...m, cantidad: 1 }))} // Adaptamos los datos
                                nombreDoctor={`${consultaSeleccionada.medico.apellido}, ${consultaSeleccionada.medico.nombre}`}
                                matriculaDoctor={consultaSeleccionada.medico.matricula}
                                especialidadDoctor={consultaSeleccionada.medico.especialidad}
                                urlQr="https://www.jerarquicos.com" // Placeholder
                            />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultaList;