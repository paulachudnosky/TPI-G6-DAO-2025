import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PacienteForm from '../components/PacienteForm';
import pacienteService from '../services/pacienteService';

const PacienteEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const data = await pacienteService.getPacienteById(id);
                setPaciente(data);
            } catch (err) {
                setError('Error fetching paciente data');
            } finally {
                setLoading(false);
            }
        };

        fetchPaciente();
    }, [id]);

    const handleUpdate = async (updatedPaciente) => {
        try {
            await pacienteService.updatePaciente(id, updatedPaciente);
            navigate('/paciente');
        } catch (err) {
            setError('Error updating paciente');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Edit Paciente</h1>
            {paciente && (
                <PacienteForm
                    initialData={paciente}
                    onSubmit={handleUpdate}
                />
            )}
        </div>
    );
};

export default PacienteEdit;