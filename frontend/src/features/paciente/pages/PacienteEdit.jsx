import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PacienteForm from '../components/PacienteForm';
import { getPacienteById, updatePaciente } from '../services/pacienteService';
import '../styles/paciente.css'; // Importamos los estilos

const PacienteEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const data = await getPacienteById(id);
                setInitialData(data);
            } catch (err) {
                setError('Error al cargar los datos del paciente.');
                alert('❌ Error al cargar los datos del paciente.');
                navigate('/pacientes');
            } finally {
                setLoading(false);
            }
        };
        fetchPaciente();
    }, [id, navigate]);

    const onSubmit = async (data) => {
        try {
            await updatePaciente(id, data);
            alert('✅ Paciente actualizado exitosamente');
            navigate('/pacientes');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al actualizar el paciente. Por favor, intente de nuevo.';
            alert(`❌ ${errorMessage}`);
        }
    };

    if (loading) return <div className="entity-loading">Cargando...</div>;

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>✏️ Editar Paciente</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/pacientes')}>
                    ← Volver a la lista
                </button>
            </div>
            {error && <div className="entity-alert entity-alert-danger">{error}</div>}
            <PacienteForm initialData={initialData} onSubmit={onSubmit} />
        </div>
    );
};

export default PacienteEdit;