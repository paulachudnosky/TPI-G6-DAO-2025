import React, { useState } from 'react';
import EspecialidadForm from '../components/EspecialidadForm';
import { createEspecialidad } from '../services/especialidadService';
import { useNavigate } from 'react-router-dom';

const EspecialidadCreate = () => {
    const [especialidad, setEspecialidad] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEspecialidad({ ...especialidad, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEspecialidad(especialidad);
            navigate('/especialidad'); // Redirect to the list page after creation
        } catch (err) {
            setError('Failed to create especialidad. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Especialidad</h2>
            {error && <p className="error">{error}</p>}
            <EspecialidadForm 
                especialidad={especialidad} 
                onChange={handleChange} 
                onSubmit={handleSubmit} 
            />
        </div>
    );
};

export default EspecialidadCreate;