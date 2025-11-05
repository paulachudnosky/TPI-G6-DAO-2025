import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HorarioAtencionForm from '../components/HorarioAtencionForm';
import { createHorarioAtencion } from '../services/horarioAtencionService';
import '../styles/horario-atencion.css';

const HorarioAtencionCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const idMedico = location.state?.idMedico; // Recibe el idMedico desde la navegación

    const handleSubmit = async (formData) => {
        try {
            // El formData que viene del formulario no contiene el id_medico.
            // Lo fusionamos aquí para asegurar que se envíe al backend,
            // ya que es requerido para la validación.
            await createHorarioAtencion({ ...formData, id_medico: idMedico });
            alert('✅ Horario creado exitosamente.');
            // Volvemos a la lista, pasando el idMedico y una señal para refrescar.
            navigate('/horario-atencion', { 
                state: { idMedico, refresh: true } 
            });
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al crear el horario. Por favor, intente de nuevo.';
            alert(`❌ ${errorMessage}`);
        }
    };

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>➕ Nuevo Horario de Atención</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/horario-atencion', { state: { idMedico } })}>
                    ← Volver a la lista
                </button>
            </div>
            <HorarioAtencionForm onSubmit={handleSubmit} initialData={{ id_medico: idMedico }} />
        </div>
    );
};

export default HorarioAtencionCreate;