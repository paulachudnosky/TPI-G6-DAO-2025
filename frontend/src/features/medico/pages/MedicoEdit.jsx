import React, { useEffect, useState } from 'react';
import MedicoForm from '../components/MedicoForm';
import { getMedico, updateMedico } from '../services/medicoService';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/medico.css';

const MedicoEdit = () => {
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

    const onSubmit = async (data) => {
        try {
            await updateMedico(id, data);
            alert('✅ Médico actualizado exitosamente');
            navigate('/medico');
        } catch (err) {
            alert('❌ Error al actualizar el médico');
            console.error(err);
        }
    };

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
                <h2>✏️ Editar Médico</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/medico')}>
                    ← Volver a la lista
                </button>
            </div>
            <MedicoForm initialData={medico} onSubmit={onSubmit} />
        </div>
    );
};

export default MedicoEdit;