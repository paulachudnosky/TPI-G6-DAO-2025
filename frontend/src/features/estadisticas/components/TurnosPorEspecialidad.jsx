import React, { useState, useEffect } from 'react';
import { getTurnosPorEspecialidad } from '../services/estadisticasService';

const TurnosPorEspecialidad = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getTurnosPorEspecialidad();
                setData(result);
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
        <div className="stat-card">
            <h4 className="stat-card-title">Turnos por Especialidad</h4>
            {loading && <div className="entity-loading">Cargando...</div>}
            {error && <div className="entity-alert entity-alert-danger">{error}</div>}
            {!loading && !error && (
                <ul className="stat-list">
                    {data.length > 0 ? data.map((item, index) => (
                        <li key={index} className="stat-list-item">
                            <span>{item.especialidad_nombre}</span>
                            <span className="stat-badge">{item.cantidad}</span>
                        </li>
                    )) : <p className="entity-text-muted">No hay datos disponibles.</p>}
                </ul>
            )}
        </div>
    );
};

export default TurnosPorEspecialidad;