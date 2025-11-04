import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import TipoConsultaTable from '../components/TipoConsultaTable';
import tipoConsultaService from '../services/tipoConsultaService';

const TipoConsultaList = () => {
    const [tipoConsultas, setTipoConsultas] = useState([]);

    useEffect(() => {
        const fetchTipoConsultas = async () => {
            const data = await tipoConsultaService.getAll();
            setTipoConsultas(data);
        };

        fetchTipoConsultas();
    }, []);

    const handleDelete = async (id) => {
        await tipoConsultaService.remove(id);
        setTipoConsultas(tipoConsultas.filter(tc => tc.id !== id));
    };

    return (
        <div className="container-fluid">
            <PageHeader title="Tipos de Consulta" to="/tipo-consulta/create" buttonText="Nuevo Tipo" color="dark" />
            <TipoConsultaTable tipoConsultas={tipoConsultas} onDelete={handleDelete} />
        </div>
    );
};

export default TipoConsultaList;