import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import MedicamentoTable from '../components/MedicamentoTable';
import medicamentoService from '../services/medicamentoService';

const MedicamentoList = () => {
    const [medicamentos, setMedicamentos] = useState([]);

    useEffect(() => {
        const fetchMedicamentos = async () => {
            const data = await medicamentoService.getAll();
            setMedicamentos(data);
        };

        fetchMedicamentos();
    }, []);

    // Nota: Backend actualmente sólo lista, sin ABM completo. No mostramos acciones.

    return (
        <div className="container-fluid">
            <PageHeader title="Medicamentos" color="secondary" />
            <MedicamentoTable medicamentos={medicamentos} />
        </div>
    );
};

export default MedicamentoList;