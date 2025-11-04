import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TipoConsultaForm from '../components/TipoConsultaForm';
import tipoConsultaService from '../services/tipoConsultaService';

const TipoConsultaCreate = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            await tipoConsultaService.createTipoConsulta(data);
            navigate('/tipo-consulta'); // Redirect to the list page after successful creation
        } catch (err) {
            setError('Error creating Tipo Consulta. Please try again.');
        }
    };

    return (
        <div>
            <h1>Create Tipo Consulta</h1>
            {error && <p className="error">{error}</p>}
            <TipoConsultaForm onSubmit={handleSubmit} />
        </div>
    );
};

export default TipoConsultaCreate;