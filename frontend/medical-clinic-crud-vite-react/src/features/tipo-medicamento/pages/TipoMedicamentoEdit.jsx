import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tipoMedicamentoService from '../services/tipoMedicamentoService';
import TipoMedicamentoForm from '../components/TipoMedicamentoForm';

const TipoMedicamentoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tipoMedicamento, setTipoMedicamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTipoMedicamento = async () => {
            try {
                const data = await tipoMedicamentoService.getTipoMedicamentoById(id);
                setTipoMedicamento(data);
            } catch (err) {
                setError('Error fetching tipo medicamento data');
            } finally {
                setLoading(false);
            }
        };

        fetchTipoMedicamento();
    }, [id]);

    const handleUpdate = async (updatedData) => {
        try {
            await tipoMedicamentoService.updateTipoMedicamento(id, updatedData);
            navigate('/tipo-medicamento'); // Redirect to the list page after update
        } catch (err) {
            setError('Error updating tipo medicamento');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Edit Tipo Medicamento</h2>
            {tipoMedicamento && (
                <TipoMedicamentoForm
                    initialData={tipoMedicamento}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    );
};

export default TipoMedicamentoEdit;