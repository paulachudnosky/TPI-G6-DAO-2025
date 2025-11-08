import React, { useState, useEffect } from 'react';
import { getTurnosPorMedicoYPeriodo } from '../services/estadisticasService';
import { getMedicos } from '../../medico/services/medicoService';

const TurnosPorMedicoPeriodo = () => {
    const [turnos, setTurnos] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [filters, setFilters] = useState({ fecha_inicio: '', fecha_fin: '', id_medico: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMedicos = async () => {
            try {
                const result = await getMedicos();
                setMedicos(result);
            } catch (err) {
                console.error("Error al cargar médicos", err);
            }
        };
        loadMedicos();
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        if (!filters.fecha_inicio) {
            alert('La fecha de inicio es obligatoria.');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const result = await getTurnosPorMedicoYPeriodo(filters);
            setTurnos(result);
        } catch (err) {
            setError('No se pudieron cargar los turnos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stat-card">
            <h4 className="stat-card-title">Listado de Turnos por Médico y Período</h4>
            <div className="stat-filters">
                <div className="entity-form-group">
                    <label className="entity-form-label required">Desde</label>
                    <input type="date" name="fecha_inicio" value={filters.fecha_inicio} onChange={handleChange} className="entity-form-input" required />
                </div>
                <div className="entity-form-group">
                    <label className="entity-form-label">Hasta</label>
                    <input type="date" name="fecha_fin" value={filters.fecha_fin} onChange={handleChange} className="entity-form-input" />
                </div>
                <div className="entity-form-group">
                    <label className="entity-form-label">Médico (opcional)</label>
                    <select name="id_medico" value={filters.id_medico} onChange={handleChange} className="entity-form-input">
                        <option value="">Todos</option>
                        {medicos.map(m => (
                            <option key={m.id_medico} value={m.id_medico}>{m.nombre} {m.apellido}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSearch} disabled={loading} className="btn-entity-primary">
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            {error && <div className="entity-alert entity-alert-danger" style={{ marginTop: '1rem' }}>{error}</div>}

            {loading && <div className="entity-loading" style={{ marginTop: '1rem' }}>Cargando...</div>}

            {!loading && turnos.length > 0 && (
                <div className="entity-table-container" style={{ marginTop: '1.5rem' }}>
                    <table className="entity-table">
                        <thead>
                            <tr>
                                <th>Fecha y Hora</th>
                                <th>Paciente</th>
                                <th>Médico</th>
                                <th>Tipo Consulta</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnos.map(turno => (
                                <tr key={turno.id_turno}>
                                    <td>{new Date(turno.fecha_hora_inicio).toLocaleString()}</td>
                                    <td>{turno.paciente.nombre} {turno.paciente.apellido}</td>
                                    <td>{turno.medico.nombre} {turno.medico.apellido}</td>
                                    <td>{turno.tipo_consulta.nombre}</td>
                                    <td><span className={`entity-badge entity-badge-${turno.estado.toLowerCase()}`}>{turno.estado}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TurnosPorMedicoPeriodo;