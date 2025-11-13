import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMedicamento } from '../services/medicamentoService';
// import '../styles/medicamento.css';

const MedicamentoView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicamento, setMedicamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedicamento = async () => {
            try {
                const data = await getMedicamento(id);
                setMedicamento(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMedicamento();
    }, [id]);

    if (loading) return <div className="entity-loading">Cargando...</div>;
    if (error) return <div className="entity-alert entity-alert-danger">{error}</div>;

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Detalles del Medicamento</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/medicamento')}>
                    ← Volver a la lista
                </button>
            </div>
            
            {medicamento ? (
                <div className="entity-view-details">
                    <h3>{medicamento.nombre}</h3>
                    
                    <div className="entity-view-group">
                        <strong>Código Nacional:</strong>
                        <p>{medicamento.codigo_nacional || 'N/A'}</p>
                    </div>

                    <div className="entity-view-group">
                        <strong>ID Tipo:</strong>
                        <p>{medicamento.id_tipo_medicamento}</p>
                    </div>
                    
                    <div className="entity-view-group">
                        <strong>Forma Farmacéutica:</strong>
                        <p>{medicamento.forma_farmaceutica || 'N/A'}</p>
                    </div>
                    
                    <div className="entity-view-group">
                        <strong>Presentación:</strong>
                        <p>{medicamento.presentacion || 'N/A'}</p>
                    </div>

                    <div className="entity-view-group">
                        <strong>Descripción:</strong>
                        <p>{medicamento.descripcion || 'Sin descripción.'}</p>
                    </div>
                    
                    <div className="entity-form-actions">
                         <button 
                            className="btn-entity-secondary" 
                            onClick={() => navigate(`/medicamento/${id}/editar`)}>
                                ✏️ Editar
                         </button>
                    </div>
                </div>
            ) : (
                <p>No se encontró el medicamento.</p>
            )}
        </div>
    );
};

export default MedicamentoView;