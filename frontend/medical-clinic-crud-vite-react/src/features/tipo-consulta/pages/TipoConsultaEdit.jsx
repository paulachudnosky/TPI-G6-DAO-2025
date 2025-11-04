import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tipoConsultaService from '../services/tipoConsultaService';
import TipoConsultaForm from '../components/TipoConsultaForm';

const TipoConsultaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tipoConsulta, setTipoConsulta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTipoConsulta = async () => {
            try {
                const data = await tipoConsultaService.getTipoConsultaById(id);
                setTipoConsulta(data);
            } catch (err) {
                setError('Error fetching tipo consulta data');
            } finally {
                setLoading(false);
            }
        };

        fetchTipoConsulta();
    }, [id]);

    const handleUpdate = async (updatedTipoConsulta) => {
        try {
            await tipoConsultaService.updateTipoConsulta(id, updatedTipoConsulta);
            navigate('/tipo-consulta');
        } catch (err) {
            setError('Error updating tipo consulta');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Edit Tipo Consulta</h2>
            {tipoConsulta && (
                <TipoConsultaForm
                    initialData={tipoConsulta}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    );
};

export default TipoConsultaEdit;