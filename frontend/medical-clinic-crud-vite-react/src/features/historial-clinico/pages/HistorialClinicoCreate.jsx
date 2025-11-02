import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HistorialClinicoForm from '../components/HistorialClinicoForm';
import historialClinicoService from '../services/historialClinicoService';

const HistorialClinicoCreate = () => {
    const [formData, setFormData] = useState({
        // Initialize your form fields here
        pacienteId: '',
        medicoId: '',
        fecha: '',
        sintomas: '',
        tratamiento: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await historialClinicoService.createHistorialClinico(formData);
            navigate('/historial-clinico'); // Redirect to the list page after creation
        } catch (error) {
            console.error('Error creating historial clinico:', error);
        }
    };

    return (
        <div>
            <h1>Create Historial Clinico</h1>
            <HistorialClinicoForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default HistorialClinicoCreate;