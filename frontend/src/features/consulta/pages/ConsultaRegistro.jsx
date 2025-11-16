import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registrarConsultaCompleta } from '../services/consultaService';
import { getMedicamentos } from '../../medicamento/services/medicamentoService'; // Asumimos que este servicio existe
import '../styles/consulta.css';

const ConsultaRegistro = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const turno = location.state?.turno;

    const [motivoConsulta, setMotivoConsulta] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [medicamentosRecetados, setMedicamentosRecetados] = useState([]);
    
    const [medicamentosDisponibles, setMedicamentosDisponibles] = useState([]);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState('');
    const [indicaciones, setIndicaciones] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar la lista de medicamentos disponibles para el selector
    useEffect(() => {
        const loadMedicamentos = async () => {
            try {
                const data = await getMedicamentos();
                setMedicamentosDisponibles(data);
            } catch (err) {
                console.error("Error al cargar medicamentos", err);
                setError("No se pudieron cargar los medicamentos para la receta.");
            }
        };
        loadMedicamentos();
    }, []);

    // Si no hay datos del turno, redirigir
    useEffect(() => {
        if (!turno) {
            alert('No se ha seleccionado un turno válido. Volviendo a la pantalla de atención.');
            navigate('/consulta');
        }
    }, [turno, navigate]);

    const handleAddMedicamento = () => {
        if (!medicamentoSeleccionado || !indicaciones) {
            alert('Por favor, seleccione un medicamento y escriba las indicaciones.');
            return;
        }

        const medicamentoExistente = medicamentosRecetados.find(med => med.id_medicamento === parseInt(medicamentoSeleccionado));
        if (medicamentoExistente) {
            alert('Este medicamento ya ha sido agregado a la receta.');
            return;
        }

        const medicamento = medicamentosDisponibles.find(med => med.id_medicamento === parseInt(medicamentoSeleccionado));

        setMedicamentosRecetados([
            ...medicamentosRecetados,
            {
                id_medicamento: medicamento.id_medicamento,
                nombre: medicamento.nombre,
                indicaciones: indicaciones
            }
        ]);

        // Limpiar campos
        setMedicamentoSeleccionado('');
        setIndicaciones('');
    };

    const handleRemoveMedicamento = (idMedicamento) => {
        setMedicamentosRecetados(medicamentosRecetados.filter(med => med.id_medicamento !== idMedicamento));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const datosConsulta = {
            id_turno: turno.id_turno,
            motivo_consulta: motivoConsulta,
            observaciones: observaciones,
            medicamentos_recetados: medicamentosRecetados.map(({ id_medicamento, indicaciones }) => ({ id_medicamento, indicaciones })),
            tiene_receta: medicamentosRecetados.length > 0 // Enviamos si la consulta tiene receta o no
        };

        try {
            await registrarConsultaCompleta(datosConsulta);
            alert('✅ Consulta y receta guardadas exitosamente.');
            navigate('/consulta'); // Volver a la pantalla de atención
        } catch (err) {
            console.error("Error al guardar la consulta:", err);
            setError('Hubo un error al guardar la consulta. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (!turno) return null; // Evita renderizar si no hay turno

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Registrar Consulta</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/consulta')}>
                    ← Cancelar y Volver
                </button>
            </div>

            <div className="consulta-section">
                <p><strong>Paciente:</strong> {turno.paciente_apellido}, {turno.paciente_nombre}</p>
                <p><strong>Médico:</strong> {turno.medico_apellido}, {turno.medico_nombre}</p>
                <p><strong>Hora del Turno:</strong> {new Date(turno.fecha_hora_inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <form onSubmit={handleSubmit} className="entity-form">
                {error && <div className="entity-alert entity-alert-danger">{error}</div>}

                <div className="entity-form-group">
                    <label htmlFor="motivo" className="entity-form-label required">Motivo de la Consulta</label>
                    <input id="motivo" className="entity-form-input" value={motivoConsulta} onChange={(e) => setMotivoConsulta(e.target.value)} required />
                </div>

                <div className="entity-form-group">
                    <label htmlFor="observaciones" className="entity-form-label">Observaciones del Médico</label>
                    <textarea id="observaciones" className="entity-form-textarea" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows="5"></textarea>
                </div>

                {/* Sección de Receta */}
                <div className="consulta-section">
                    <h3 className="consulta-section-title">Receta</h3>
                    <div className="entity-form-group">
                        <label htmlFor="medicamento" className="entity-form-label">Medicamento</label>
                        <select id="medicamento" className="entity-form-select" value={medicamentoSeleccionado} onChange={(e) => setMedicamentoSeleccionado(e.target.value)}>
                            <option value="">-- Seleccionar medicamento --</option>
                            {medicamentosDisponibles.map(med => (
                                <option key={med.id_medicamento} value={med.id_medicamento}>{med.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="entity-form-group">
                        <label htmlFor="indicaciones" className="entity-form-label">Indicaciones (Posología)</label>
                        <input id="indicaciones" className="entity-form-input" value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} placeholder="Ej: Tomar 1 comprimido cada 8 horas" />
                    </div>
                    <button type="button" className="btn-entity-secondary" onClick={handleAddMedicamento}>+ Agregar a la Receta</button>

                    {medicamentosRecetados.length > 0 && (
                        <div className="entity-table-container entity-mt-2">
                            <table className="entity-table">
                                <thead><tr><th>Medicamento</th><th>Indicaciones</th><th>Acción</th></tr></thead>
                                <tbody>
                                    {medicamentosRecetados.map(med => (
                                        <tr key={med.id_medicamento}>
                                            <td>{med.nombre}</td>
                                            <td>{med.indicaciones}</td>
                                            <td><button type="button" className="btn-entity-danger btn-entity-sm" onClick={() => handleRemoveMedicamento(med.id_medicamento)}>Quitar</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="entity-form-actions">
                    <button type="submit" className="btn-entity-primary" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Consulta'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsultaRegistro;