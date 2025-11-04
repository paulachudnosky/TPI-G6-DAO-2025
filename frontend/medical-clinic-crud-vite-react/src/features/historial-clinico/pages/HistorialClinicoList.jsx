import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import HistorialClinicoTable from '../components/HistorialClinicoTable';
import historialClinicoService from '../services/historialClinicoService';

const HistorialClinicoList = () => {
    const [historialClinicos, setHistorialClinicos] = useState([]);

    useEffect(() => {
        const fetchHistorialClinicos = async () => {
            const data = await historialClinicoService.getAll();
            setHistorialClinicos(data);
        };

        fetchHistorialClinicos();
    }, []);

    // Nota: Evitamos acciones de creación/borrado si el backend aún no las soporta

    return (
        <div className="container-fluid">
            <PageHeader title="Historial Clínico" color="primary" />
            <HistorialClinicoTable historialClinicos={historialClinicos} />
        </div>
    );
};

export default HistorialClinicoList;