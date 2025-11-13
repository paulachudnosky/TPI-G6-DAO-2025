import React, { useState, useEffect } from 'react';
import { getTurnosPorPeriodo } from '../../turno/services/turnoService'; // Corregido para usar el servicio de turno directamente
import { getMedicos } from '../../medico/services/medicoService';

const TurnosPorMedicoPeriodo = () => {
    const [turnos, setTurnos] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [filters, setFilters] = useState({ fecha_inicio: '', fecha_fin: '', id_medico: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8; // Puedes ajustar este número

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
            const result = await getTurnosPorPeriodo(filters.fecha_inicio, filters.fecha_fin, filters.id_medico || null);
            setTurnos(result);
            setCurrentPage(1); // Resetear a la primera página en cada nueva búsqueda
        } catch (err) {
            setError('No se pudieron cargar los turnos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- Lógica de Paginación ---
    const totalPages = Math.ceil(turnos.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentTurnos = turnos.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                    <label className="entity-form-label">Hasta</label>
                    <input type="date" name="fecha_fin" value={filters.fecha_fin} onChange={handleChange} className="entity-form-input" />
                </div>
                <div className="entity-form-group">
                    <label className="entity-form-label">Médico</label>
                    <select name="id_medico" value={filters.id_medico} onChange={handleChange} className="entity-form-input">
                        <option value="">Todos los médicos</option>
                        {medicos.map(m => (
                            <option key={m.id_medico} value={m.id_medico}>{m.apellido}, {m.nombre}</option>
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
                
                <div className="entity-table-container">
                    <table className="entity-table">
                        <thead>
                            <tr>
                                <th>Fecha y Hora</th>
                                <th>Paciente</th>
                                <th>Médico</th>
                                <th>Tipo de Consulta</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="entity-loading">Cargando...</td></tr>
                            ) : turnos.length > 0 ? (
                                currentTurnos.map(turno => (
                                    <tr key={turno.id_turno}>
                                        <td>{new Date(turno.fecha_hora_inicio).toLocaleString('es-AR')}</td>
                                        <td>{`${turno.paciente.apellido}, ${turno.paciente.nombre}`}</td>
                                        <td>{`${turno.medico.apellido}, ${turno.medico.nombre}`}</td>
                                        <td>{turno.tipo_consulta.nombre}</td>
                                        <td><span className={`status-badge status-${turno.estado.toLowerCase().replace(/\s+/g, '-')}`}>{turno.estado}</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="empty-state">No se encontraron turnos con los filtros seleccionados.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Controles de Paginación */}
                {totalPages > 1 && (
                    <div className="pagination-container">
                        <button onClick={handlePrevPage} disabled={currentPage === 1} className="btn-pagination">
                            Anterior
                        </button>
                        <span className="pagination-info">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn-pagination">
                            Siguiente
                        </button>
                    </div>
                )}
        </div>
        </div>
    );
}
export default TurnosPorMedicoPeriodo;