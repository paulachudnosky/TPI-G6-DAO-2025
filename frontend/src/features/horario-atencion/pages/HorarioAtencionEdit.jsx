import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HorarioAtencionForm from '../components/HorarioAtencionForm';
import { getHorarioById, updateHorarioAtencion } from '../services/horarioAtencionService';
import '../styles/horario-atencion.css';

const HorarioAtencionEdit = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [idMedico, setIdMedico] = useState(location.state?.idMedico || null); // Recibimos el idMedico
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getHorarioById(id);
                setInitialData(data);
                if (!idMedico) {
                    setIdMedico(data.id_medico); // Si no vino por state, lo tomamos de la data cargada
                }
            } catch (err) {
                setError('Error al cargar el horario.');
                alert('❌ Error al cargar el horario.');
                navigate('/horario-atencion');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    const handleSubmit = async (formData) => {
        try {
            // El formData que viene del formulario no contiene el id_medico.
            // Lo fusionamos aquí para asegurar que se envíe al backend,
            // ya que es requerido para la validación.
            const dataToSend = { ...formData, id_medico: idMedico };
            await updateHorarioAtencion(id, dataToSend);
            alert('✅ Horario actualizado exitosamente');
            navigate('/horario-atencion', { state: { idMedico } }); // Vuelve a la lista con el médico seleccionado
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al actualizar el horario. Por favor, intente de nuevo.';
            alert(`❌ ${errorMessage}`);
        }
    };

    if (loading) return <div className="entity-loading">Cargando...</div>;

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>✏️ Editar Horario de Atención</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/horario-atencion', { state: { idMedico } })}>
                    ← Volver a la lista
                </button>
            </div>
            {error && <div className="entity-alert entity-alert-danger">{error}</div>}
            <HorarioAtencionForm initialData={initialData} onSubmit={handleSubmit} />
        </div>
    );
};

export default HorarioAtencionEdit;