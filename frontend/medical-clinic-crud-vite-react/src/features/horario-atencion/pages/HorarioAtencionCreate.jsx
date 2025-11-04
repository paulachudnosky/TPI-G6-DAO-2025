import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HorarioAtencionForm from '../components/HorarioAtencionForm';
import horarioAtencionService from '../services/horarioAtencionService';

const HorarioAtencionCreate = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            await horarioAtencionService.createHorarioAtencion(data);
            navigate('/horario-atencion'); // Redirect to the list page after successful creation
        } catch (err) {
            setError('Error creating Horario de Atención. Please try again.');
        }
    };

    return (
        <div>
            <h1>Create Horario de Atención</h1>
            {error && <p className="error">{error}</p>}
            <HorarioAtencionForm onSubmit={handleSubmit} />
        </div>
    );
};

export default HorarioAtencionCreate;