import React, { useEffect, useState } from 'react';
import { getMedico } from '../services/medicoService';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/medico.css';

const MedicoView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medico, setMedico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedico = async () => {
            try {
                const data = await getMedico(id);
                setMedico(data);
            } catch (err) {
                setError('Error al cargar el médico');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMedico();
    }, [id]);

    if (loading) {
        return <div className="entity-loading">Cargando médico...</div>;
    }

    if (error) {
        return (
            <div className="entity-container">
                <div className="entity-alert entity-alert-danger">{error}</div>
                <button className="btn-entity-secondary" onClick={() => navigate('/medico')}>
                    ← Volver a la lista
                </button>
            </div>
        );
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>👁️ Detalle de Médico</h2>
                <div className="entity-gap-2" style={{ display: 'flex' }}>
                    <button
                        className="btn-entity-primary"
                        onClick={() => navigate(`/medico/${id}/editar`)}
                    >
                        ✏️ Editar
                    </button>
                    <button
                        className="btn-entity-secondary"
                        onClick={() => navigate('/medico')}
                    >
                        ← Volver a la lista
                    </button>
                </div>
            </div>

            <div className="entity-detail-card">
                <div className="entity-detail-row">
                    <span className="entity-detail-label">ID:</span>
                    <span className="entity-detail-value">{medico.id_medico}</span>
                </div>
                <div className="entity-detail-row">
                    <span className="entity-detail-label">Nombre:</span>
                    <span className="entity-detail-value">{medico.nombre}</span>
                </div>
                <div className="entity-detail-row">
                    <span className="entity-detail-label">Apellido:</span>
                    <span className="entity-detail-value">{medico.apellido}</span>
                </div>
                <div className="entity-detail-row">
                    <span className="entity-detail-label">Matrícula:</span>
                    <span className="entity-detail-value">
                        <span className="entity-badge entity-badge-primary">
                            {medico.matricula}
                        </span>
                    </span>
                </div>
                <div className="entity-detail-row">
                    <span className="entity-detail-label">Email:</span>
                    <span className="entity-detail-value">
                        {medico.email || <span className="entity-text-muted">Sin email registrado</span>}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MedicoView;