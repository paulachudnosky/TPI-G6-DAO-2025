import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pacienteService from '../../services/pacienteService';

const PacienteForm = ({ pacienteId }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (pacienteId) {
            const fetchPaciente = async () => {
                const paciente = await pacienteService.getPacienteById(pacienteId);
                setNombre(paciente.nombre);
                setApellido(paciente.apellido);
                setDni(paciente.dni);
                setTelefono(paciente.telefono);
                setDireccion(paciente.direccion);
            };
            fetchPaciente();
        }
    }, [pacienteId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pacienteData = { nombre, apellido, dni, telefono, direccion };
        if (pacienteId) {
            await pacienteService.updatePaciente(pacienteId, pacienteData);
        } else {
            await pacienteService.createPaciente(pacienteData);
        }
        navigate('/pacientes');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
                <label>Apellido:</label>
                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </div>
            <div>
                <label>DNI:</label>
                <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
            </div>
            <div>
                <label>Teléfono:</label>
                <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
            <div>
                <label>Dirección:</label>
                <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            </div>
            <button type="submit">{pacienteId ? 'Actualizar' : 'Crear'} Paciente</button>
        </form>
    );
};

export default PacienteForm;