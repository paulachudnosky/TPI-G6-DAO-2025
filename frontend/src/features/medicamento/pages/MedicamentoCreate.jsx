import React from 'react';
import MedicamentoForm from '../components/MedicamentoForm';
import { createMedicamento } from '../services/medicamentoService';
import { useNavigate } from 'react-router-dom';
// import '../styles/medicamento.css';

const MedicamentoCreate = () => {
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await createMedicamento(data);
            alert('✅ Medicamento creado exitosamente');
            navigate('/medicamento');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al crear el medicamento.';
            alert(`❌ ${errorMessage}`);
        }
    };

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>➕ Nuevo Medicamento</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/medicamento')}>
                    ← Volver a la lista
                </button>
            </div>
            <MedicamentoForm onSubmit={onSubmit} />
        </div>
    );
};

export default MedicamentoCreate;