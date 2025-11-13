import React, { useState, useEffect } from 'react';
import { getTurnosPorEspecialidad } from '../services/estadisticasService';

const TurnosPorEspecialidad = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carga de datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getTurnosPorEspecialidad();
                // Ordenamos los datos de mayor a menor para un mejor gráfico
                setData(result.sort((a, b) => b.cantidad - a.cantidad));
            } catch (err) {
                setError('No se pudieron cargar las estadísticas de turnos por especialidad.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="report-results">
            <h3 className="report-section-title">Cantidad de Turnos por Especialidad</h3>
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