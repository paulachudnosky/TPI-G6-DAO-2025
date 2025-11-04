import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tipoConsultaService from '../services/tipoConsultaService';

const TipoConsultaView = () => {
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Tipo Consulta Details</h1>
            {tipoConsulta ? (
                <div>
                    <h2>{tipoConsulta.name}</h2>
                    <p>{tipoConsulta.description}</p>
                    <button onClick={() => navigate('/tipo-consulta')}>Back to List</button>
                </div>
            ) : (
                <p>No details available</p>
            )}
        </div>
    );
};

export default TipoConsultaView;