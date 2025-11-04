import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PacienteForm from '../components/PacienteForm';
import pacienteService from '../services/pacienteService';

const PacienteCreate = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCreate = async (pacienteData) => {
        try {
            await pacienteService.createPaciente(pacienteData);
            navigate('/paciente'); // Redirect to the list page after creation
        } catch (err) {
            setError('Error creating paciente. Please try again.');
        }
    };

    return (
        <div>
            <h1>Create Paciente</h1>
            {error && <p className="error">{error}</p>}
            <PacienteForm onSubmit={handleCreate} />
        </div>
    );
};

export default PacienteCreate;