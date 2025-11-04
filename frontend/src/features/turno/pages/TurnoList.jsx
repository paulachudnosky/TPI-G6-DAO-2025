import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import { fetchTurnos } from '../services/turnoService';
import TurnoTable from '../components/TurnoTable';

const TurnoList = () => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTurnos = async () => {
            try {
                const data = await fetchTurnos();
                setTurnos(data);
            } catch (error) {
                console.error('Error fetching turnos:', error);
            } finally {
                setLoading(false);
            }
        };

        getTurnos();
    }, []);

    if (loading) return <div className="alert alert-info">Cargando...</div>;

    return (
        <div className="container-fluid">
            <PageHeader title="Turnos" to="/turno/create" buttonText="Nuevo Turno" color="primary" />
            <TurnoTable turnos={turnos} />
        </div>
    );
};

export default TurnoList;