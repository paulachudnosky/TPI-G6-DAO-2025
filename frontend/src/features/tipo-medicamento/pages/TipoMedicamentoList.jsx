import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import TipoMedicamentoTable from '../components/TipoMedicamentoTable';
import tipoMedicamentoService from '../services/tipoMedicamentoService';

const TipoMedicamentoList = () => {
    const [tipoMedicamentos, setTipoMedicamentos] = useState([]);

    useEffect(() => {
        const fetchTipoMedicamentos = async () => {
            const data = await tipoMedicamentoService.getAll();
            setTipoMedicamentos(data);
        };

        fetchTipoMedicamentos();
    }, []);

    // Nota: se deja en modo sólo lectura hasta confirmar endpoints de ABM

    return (
        <div className="container-fluid">
            <PageHeader title="Tipos de Medicamento" color="danger" />
            <TipoMedicamentoTable tipoMedicamentos={tipoMedicamentos} />
        </div>
    );
};

export default TipoMedicamentoList;