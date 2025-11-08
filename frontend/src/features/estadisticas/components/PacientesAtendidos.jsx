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
            alert('La fecha de inicio y la especialidad son obligatorias.');
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
        <div className="stat-card">
            <h4 className="stat-card-title">Pacientes Únicos Atendidos</h4>
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
                    <label className="entity-form-label required">Especialidad</label>
                    <select name="id_especialidad" value={filters.id_especialidad} onChange={handleChange} className="entity-form-input" required>
                        <option value="">Seleccione...</option>
                        {especialidades.map(e => (
                            <option key={e.id_especialidad} value={e.id_especialidad}>{e.nombre}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleSearch} disabled={loading} className="btn-entity-primary">
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            {error && <div className="entity-alert entity-alert-danger" style={{ marginTop: '1rem' }}>{error}</div>}

            {data && (
                <div className="stat-result">
                    <p>Total de pacientes únicos atendidos:</p>
                    <span className="stat-big-number">{data.pacientes_atendidos}</span>
                </div>
            )}
             {!data && !loading && <p className="entity-text-muted" style={{ marginTop: '1rem' }}>Complete los filtros obligatorios y haga clic en "Buscar".</p>}
        </div>
    );
};

export default PacientesAtendidos;