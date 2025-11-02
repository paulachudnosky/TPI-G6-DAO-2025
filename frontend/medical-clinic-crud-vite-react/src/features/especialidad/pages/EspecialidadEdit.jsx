import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EspecialidadForm from '../components/EspecialidadForm';
import especialidadService from '../services/especialidadService';

const EspecialidadEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [especialidad, setEspecialidad] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEspecialidad = async () => {
            try {
                const data = await especialidadService.getEspecialidadById(id);
                setEspecialidad(data);
            } catch (err) {
                setError('Error fetching especialidad data');
            } finally {
                setLoading(false);
            }
        };

        fetchEspecialidad();
    }, [id]);

    const handleSubmit = async (updatedEspecialidad) => {
        try {
            await especialidadService.updateEspecialidad(id, updatedEspecialidad);
            navigate('/especialidad');
        } catch (err) {
            setError('Error updating especialidad');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Edit Especialidad</h2>
            {especialidad && (
                <EspecialidadForm
                    initialData={especialidad}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default EspecialidadEdit;