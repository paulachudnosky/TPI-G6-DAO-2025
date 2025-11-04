import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import historialClinicoService from '../services/historialClinicoService';
import HistorialClinicoForm from '../components/HistorialClinicoForm';

const HistorialClinicoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [historialClinico, setHistorialClinico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistorialClinico = async () => {
            try {
                const data = await historialClinicoService.getById(id);
                setHistorialClinico(data);
            } catch (err) {
                setError('Error fetching historial clinico data');
            } finally {
                setLoading(false);
            }
        };

        fetchHistorialClinico();
    }, [id]);

    const handleSubmit = async (updatedData) => {
        try {
            await historialClinicoService.update(id, updatedData);
            navigate('/historial-clinico');
        } catch (err) {
            setError('Error updating historial clinico');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!historialClinico) return <div>No data found</div>;

    return (
        <div>
            <h2>Edit Historial Clinico</h2>
            <HistorialClinicoForm 
                initialData={historialClinico} 
                onSubmit={handleSubmit} 
            />
        </div>
    );
};

export default HistorialClinicoEdit;