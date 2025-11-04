import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import medicamentoService from '../services/medicamentoService';
import MedicamentoForm from '../components/MedicamentoForm';

const MedicamentoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicamento, setMedicamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedicamento = async () => {
            try {
                const data = await medicamentoService.getMedicamentoById(id);
                setMedicamento(data);
            } catch (err) {
                setError('Error fetching medicamento data');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicamento();
    }, [id]);

    const handleSubmit = async (updatedMedicamento) => {
        try {
            await medicamentoService.updateMedicamento(id, updatedMedicamento);
            navigate('/medicamentos'); // Redirect to the list page after editing
        } catch (err) {
            setError('Error updating medicamento');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Edit Medicamento</h2>
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