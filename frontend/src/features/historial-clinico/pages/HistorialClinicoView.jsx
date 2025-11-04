import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import historialClinicoService from '../services/historialClinicoService';

const HistorialClinicoView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [historialClinico, setHistorialClinico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistorialClinico = async () => {
            try {
                const data = await historialClinicoService.getHistorialClinicoById(id);
                setHistorialClinico(data);
            } catch (err) {
                setError('Error fetching historial clinico data');
            } finally {
                setLoading(false);
            }
        };

        fetchHistorialClinico();
    }, [id]);

    const handleBack = () => {
        navigate('/historial-clinico');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Historial Clinico Details</h1>
            {historialClinico ? (
                <div>
                    <p><strong>ID:</strong> {historialClinico.id}</p>
                    <p><strong>Paciente:</strong> {historialClinico.paciente}</p>
                    <p><strong>Medico:</strong> {historialClinico.medico}</p>
                    <p><strong>Fecha:</strong> {historialClinico.fecha}</p>
                    <p><strong>Detalles:</strong> {historialClinico.detalles}</p>
                </div>
            ) : (
                <p>No data found</p>
            )}
            <button onClick={handleBack}>Back to List</button>
        </div>
    );
};

export default HistorialClinicoView;