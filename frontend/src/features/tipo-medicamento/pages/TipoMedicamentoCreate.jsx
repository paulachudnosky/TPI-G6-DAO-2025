import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TipoMedicamentoForm from '../components/TipoMedicamentoForm';
import tipoMedicamentoService from '../services/tipoMedicamentoService';

const TipoMedicamentoCreate = () => {
    const [tipoMedicamento, setTipoMedicamento] = useState({ nombre: '', descripcion: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTipoMedicamento({ ...tipoMedicamento, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await tipoMedicamentoService.createTipoMedicamento(tipoMedicamento);
            navigate('/tipo-medicamento'); // Redirect to the list page after creation
        } catch (err) {
            setError('Error creating tipo medicamento. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Tipo Medicamento</h2>
            {error && <p className="error">{error}</p>}
            <TipoMedicamentoForm 
                tipoMedicamento={tipoMedicamento} 
                onChange={handleChange} 
                onSubmit={handleSubmit} 
            />
        </div>
    );
};

export default TipoMedicamentoCreate;