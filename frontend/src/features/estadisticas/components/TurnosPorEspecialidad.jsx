import React, { useState, useEffect } from 'react';
import { getTurnosPorEspecialidad } from '../services/estadisticasService';

const TurnosPorEspecialidad = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'year'

    // Carga de datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                let fecha_inicio = null;
                let fecha_fin = null;
                const today = new Date();

                if (activeFilter !== 'all') {
                    fecha_fin = today.toISOString().split('T')[0];
                    let startDate = new Date();

                    switch (activeFilter) {
                        case 'today':
                            // La fecha de inicio es hoy mismo
                            break;
                        case 'week':
                            startDate.setDate(today.getDate() - 7);
                            break;
                        case 'month':
                            startDate.setMonth(today.getMonth() - 1);
                            break;
                        case 'year':
                            startDate.setFullYear(today.getFullYear() - 1);
                            break;
                        default:
                            break;
                    }
                    fecha_inicio = startDate.toISOString().split('T')[0];
                }

                const result = await getTurnosPorEspecialidad({ fecha_inicio, fecha_fin });
                // Ordenamos los datos de mayor a menor para un mejor gráfico
                setData(result.sort((a, b) => b.cantidad - a.cantidad));
            } catch (err) {
                setError('No se pudieron cargar las estadísticas de turnos por especialidad.');
                console.error(err);
                setData([]); // Limpiar datos en caso de error
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeFilter]);

    return (
        <div className="report-results">
            <h3 className="report-section-title">Cantidad de Turnos por Especialidad</h3>
            <div className="report-filters-buttons">
                <button onClick={() => setActiveFilter('today')} className={`btn-filter ${activeFilter === 'today' ? 'active' : ''}`}>Hoy</button>
                <button onClick={() => setActiveFilter('week')} className={`btn-filter ${activeFilter === 'week' ? 'active' : ''}`}>Última Semana</button>
                <button onClick={() => setActiveFilter('month')} className={`btn-filter ${activeFilter === 'month' ? 'active' : ''}`}>Último Mes</button>
                <button onClick={() => setActiveFilter('year')} className={`btn-filter ${activeFilter === 'year' ? 'active' : ''}`}>Último Año</button>
                <button onClick={() => setActiveFilter('all')} className={`btn-filter ${activeFilter === 'all' ? 'active' : ''}`}>Desde Siempre</button>
            </div>

            {loading && <div className="entity-loading">Cargando...</div>}
            {error && <div className="entity-alert entity-alert-danger">{error}</div>}
            {!loading && !error && (
                <ul className="stats-list">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <li key={index} className="stats-list-item">
                                <span className="stats-list-label">{item.especialidad_nombre}</span>
                                <span className="stats-list-value">{item.cantidad}</span>
                            </li>
                        ))
                    ) : (
                        <div className="empty-state">No hay datos de turnos por especialidad para mostrar.</div>
                    )}
                </ul>
            )}
        </div>
    );
};

export default TurnosPorEspecialidad;