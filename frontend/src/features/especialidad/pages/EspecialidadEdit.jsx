import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EspecialidadForm from '../components/EspecialidadForm';
import { getEspecialidad, updateEspecialidad } from '../services/especialidadService';
import '../styles/especialidad.css';

const EspecialidadEdit = () => {
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

    const handleSubmit = async (updatedEspecialidad) => {
        try {
            await updateEspecialidad(id, updatedEspecialidad);
            alert('✅ Especialidad actualizada exitosamente');
            navigate('/especialidad');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al actualizar la especialidad.';
            alert(`❌ ${errorMessage}`);
            console.error(err);
        }
    };

    if (loading) return <div className="entity-loading">Cargando...</div>;

    if (error) {
        return (
            <div className="entity-container">
                <div className="entity-alert entity-alert-danger">{error}</div>
                <button className="btn-entity-secondary" onClick={() => navigate('/especialidad')}>
                    ← Volver a la lista
                </button>
            </div>
        );
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>✏️ Editar Especialidad</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/especialidad')}>
                    ← Volver a la lista
                </button>
            </div>
            <EspecialidadForm
                initialData={especialidad}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default EspecialidadEdit;