import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MedicamentoForm from '../components/MedicamentoForm';
import { getMedicamento, updateMedicamento } from '../services/medicamentoService';
// import '../styles/medicamento.css';

const MedicamentoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicamento, setMedicamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedicamento = async () => {
            try {
                const data = await getMedicamento(id);
                setMedicamento(data);
            } catch (err) {
                setError('Error al cargar el medicamento');
            } finally {
                setLoading(false);
            }
        };
        fetchMedicamento();
    }, [id]);

    const handleSubmit = async (updatedData) => {
        try {
            await updateMedicamento(id, updatedData);
            alert('✅ Medicamento actualizado exitosamente');
            navigate('/medicamento');
        } catch (err) {
            setError('Error al actualizar el medicamento');
        }
    };

    if (loading) return <div className="entity-loading">Cargando...</div>;
    if (error) return <div className="entity-alert entity-alert-danger">{error}</div>;

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>✏️ Editar Medicamento</h2>
                <button className="btn-entity-secondary" onClick={() => navigate('/medicamento')}>
                    ← Volver a la lista
                </button>
            </div>
            {medicamento && (
                <MedicamentoForm
                    initialData={medicamento}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default MedicamentoEdit;