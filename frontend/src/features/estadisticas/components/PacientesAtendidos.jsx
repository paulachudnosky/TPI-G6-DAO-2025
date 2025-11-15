import React, { useState, useEffect } from 'react';
import { getPacientesAtendidos } from '../services/estadisticasService';
import { getEspecialidades } from '../../especialidad/services/especialidadService';

const PacientesAtendidos = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ fecha_inicio: '', fecha_fin: '', id_especialidad: '' });
    const [especialidades, setEspecialidades] = useState([]);

    useEffect(() => {
        const loadEspecialidades = async () => {
            try {
                const result = await getEspecialidades();
                setEspecialidades(result);
            } catch (err) {
                console.error("Error al cargar especialidades", err);
            }
        };
        loadEspecialidades();
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        if (!filters.fecha_inicio || !filters.id_especialidad) {
            setError('La fecha de inicio y la especialidad son obligatorias.');
            return;
        }

        // Si la fecha "Hasta" está vacía, usamos la fecha actual para la validación.
        const fechaFinValidacion = filters.fecha_fin || new Date().toISOString().split('T')[0];

        if (filters.fecha_inicio > fechaFinValidacion) {
            setError('La fecha "Desde" no puede ser posterior a la fecha "Hasta". Si "Hasta" está vacío, se compara con la fecha de hoy.');
            setData(null); // Limpiamos resultados anteriores si los hay
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await getPacientesAtendidos(filters);
            setData(result);
        } catch (err) {
            setError('No se pudieron cargar las estadísticas de pacientes atendidos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-layout">
            {/* Columna de Filtros (Izquierda) */}
            <div className="report-filters">
                <h3 className="report-section-title">Filtros</h3>
                <div className="entity-form-group">
                    <label className="entity-form-label required">Desde</label>
                    <input type="date" name="fecha_inicio" value={filters.fecha_inicio} onChange={handleChange} className="entity-form-input" required />
                </div>
                <div className="entity-form-group">
                    <label className="entity-form-label">
                        Hasta <span className="entity-text-muted" style={{ fontWeight: 'normal', fontSize: '0.8em' }}>(por defecto: hoy)</span>
                    </label>
                    <input type="date" name="fecha_fin" value={filters.fecha_fin} onChange={handleChange} className="entity-form-input" />
                </div>
                <div className="entity-form-group">
                    <label className="entity-form-label required">Especialidad</label>
                    <select name="id_especialidad" value={filters.id_especialidad} onChange={handleChange} className="entity-form-input" required>
                        <option value="">Seleccione una especialidad</option>
                        {especialidades.map(e => (
                            <option key={e.id_especialidad} value={e.id_especialidad}>{e.nombre}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSearch} disabled={loading} className="btn-entity-primary">
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            {/* Columna de Resultados (Derecha) */}
            <div className="report-results">
                <h3 className="report-section-title">Resultados</h3>
                {error && <div className="entity-alert entity-alert-danger">{error}</div>}
                
                {loading ? (
                    <div className="entity-loading">Cargando...</div>
                ) : data ? (
                    <div className="stat-result-card">
                        <p className="stat-result-label">Total de pacientes únicos atendidos:</p>
                        <span className="stat-result-number">{data.pacientes_atendidos}</span>
                    </div>
                ) : (
                    <div className="empty-state">Complete los filtros obligatorios y haga clic en "Buscar".</div>
                )}
            </div>
        </div>
    );
};

export default PacientesAtendidos;