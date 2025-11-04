import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TurnoForm from '../components/TurnoForm';
import turnoService from '../services/turnoService';

const TurnoCreate = () => {
    const [turno, setTurno] = useState({
        fecha: '',
        hora: '',
        pacienteId: '',
        medicoId: '',
        tipoConsultaId: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTurno({ ...turno, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await turnoService.createTurno(turno);
            navigate('/turnos'); // Redirect to the list of turnos after creation
        } catch (err) {
            setError('Error creating turno. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Turno</h2>
            {error && <p className="error">{error}</p>}
            <TurnoForm 
                turno={turno} 
                onChange={handleChange} 
                onSubmit={handleSubmit} 
            />
        </div>
    );
};

export default TurnoCreate;