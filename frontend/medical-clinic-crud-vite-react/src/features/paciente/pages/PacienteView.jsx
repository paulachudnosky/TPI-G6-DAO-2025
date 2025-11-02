import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pacienteService from '../services/pacienteService';

const PacienteView = () => {
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

    const handleBack = () => {
        navigate('/paciente');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Paciente Details</h1>
            {paciente ? (
                <div>
                    <p><strong>ID:</strong> {paciente.id}</p>
                    <p><strong>Name:</strong> {paciente.name}</p>
                    <p><strong>Age:</strong> {paciente.age}</p>
                    <p><strong>Gender:</strong> {paciente.gender}</p>
                    <p><strong>Address:</strong> {paciente.address}</p>
                    {/* Add more fields as necessary */}
                </div>
            ) : (
                <p>No paciente found</p>
            )}
            <button onClick={handleBack}>Back to List</button>
        </div>
    );
};

export default PacienteView;