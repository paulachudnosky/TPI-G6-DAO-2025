import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEspecialidad } from '../services/especialidadService';
import '../styles/especialidad.css';

const EspecialidadView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [especialidad, setEspecialidad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEspecialidad = async () => {
            try {
                const data = await getEspecialidad(id);
                setEspecialidad(data);
            } catch (err) {
                setError('Error al cargar los datos de la especialidad.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEspecialidad();
    }, [id, navigate]);

    if (loading) return <div className="entity-loading">Cargando...</div>;

    if (error || !especialidad) {
        return (
            <div className="entity-container">
                <div className="entity-alert entity-alert-danger">{error || 'Especialidad no encontrada'}</div>
                <button className="btn-entity-secondary" onClick={() => navigate('/especialidad')}>
                    ← Volver a la lista
                </button>
            </div>
        );
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>👁️ Detalle de Especialidad</h2>
                <div className="entity-header-actions">
                    <button className="btn-entity-primary" onClick={() => navigate(`/especialidad/${id}/editar`)}>
                        ✏️ Editar
                    </button>
                    <button className="btn-entity-secondary" onClick={() => navigate('/especialidad')} style={{ marginLeft: '0.5rem' }}>
                        ← Volver a la lista
                    </button>
                </div>
            </div>
            <div className="entity-detail">
                <div className="entity-detail-group">
                    <label className="entity-detail-label">Nombre:</label>
                    <p className="entity-detail-value">{especialidad.nombre}</p>
                </div>
                <div className="entity-detail-group">
                    <label className="entity-detail-label">Descripción:</label>
                    <p className="entity-detail-value">{especialidad.descripcion || <span className="entity-text-muted">Sin descripción</span>}</p>
                </div>
                <div className="entity-detail-group">
                    <label className="entity-detail-label">Estado:</label>
                    <p className="entity-detail-value">
                        <span className={`entity-badge ${especialidad.activo ? 'entity-badge-success' : 'entity-badge-secondary'}`}>
                            {especialidad.activo ? 'Activa' : 'Inactiva'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EspecialidadView;