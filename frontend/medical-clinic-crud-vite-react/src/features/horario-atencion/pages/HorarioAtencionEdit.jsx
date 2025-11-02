import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HorarioAtencionForm from '../components/HorarioAtencionForm';
import horarioAtencionService from '../services/horarioAtencionService';

const HorarioAtencionEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [horarioAtencion, setHorarioAtencion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHorarioAtencion = async () => {
            try {
                const data = await horarioAtencionService.getHorarioAtencionById(id);
                setHorarioAtencion(data);
            } catch (err) {
                setError('Error fetching horario de atención');
            } finally {
                setLoading(false);
            }
        };

        fetchHorarioAtencion();
    }, [id]);

    const handleSubmit = async (updatedHorarioAtencion) => {
        try {
            await horarioAtencionService.updateHorarioAtencion(id, updatedHorarioAtencion);
            navigate('/horario-atencion');
        } catch (err) {
            setError('Error updating horario de atención');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Edit Horario de Atención</h2>
            {horarioAtencion && (
                <HorarioAtencionForm
                    initialData={horarioAtencion}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default HorarioAtencionEdit;