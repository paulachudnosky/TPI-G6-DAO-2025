import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicamentoForm from '../components/MedicamentoForm';
import medicamentoService from '../services/medicamentoService';

const MedicamentoCreate = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (medicamentoData) => {
        try {
            await medicamentoService.createMedicamento(medicamentoData);
            navigate('/medicamentos'); // Redirect to the list of medicamentos after creation
        } catch (err) {
            setError('Error creating medicamento. Please try again.');
        }
    };

    return (
        <div>
            <h1>Create Medicamento</h1>
            {error && <p className="error">{error}</p>}
            <MedicamentoForm onSubmit={handleSubmit} />
        </div>
    );
};

export default MedicamentoCreate;