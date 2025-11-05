import React from 'react';
import { useNavigate } from 'react-router-dom';
import PacienteForm from '../components/PacienteForm';
import { createPaciente } from '../services/pacienteService';
import '../styles/paciente.css'; // Importamos los estilos de la entidad

const PacienteCreate = () => {
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await createPaciente(data);
            alert('✅ Paciente creado exitosamente');
            navigate('/pacientes'); // Navegamos a la lista
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al crear el paciente. Por favor, intente de nuevo.';
            alert(`❌ ${errorMessage}`);
        }
    };

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>➕ Nuevo Paciente</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/pacientes')}>
                    ← Volver a la lista
                </button>
            </div>
            <PacienteForm onSubmit={onSubmit} />
        </div>
    );
};

export default PacienteCreate;