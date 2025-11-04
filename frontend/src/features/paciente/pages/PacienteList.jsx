import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader';
import PacienteTable from '../components/PacienteTable';
import pacienteService from '../services/pacienteService';

const PacienteList = () => {
    const [pacientes, setPacientes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPacientes = async () => {
            const data = await pacienteService.getAll();
            setPacientes(data);
        };

        fetchPacientes();
    }, []);

    const handleDelete = async (id) => {
        await pacienteService.remove(id);
        setPacientes(pacientes.filter(paciente => paciente.id !== id));
    };

    return (
        <div className="container-fluid">
            <PageHeader title="Pacientes" to="/paciente/create" buttonText="Nuevo Paciente" color="warning" />
            <PacienteTable
                pacientes={pacientes}
                onEdit={(id) => navigate(`/paciente/edit/${id}`)}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default PacienteList;