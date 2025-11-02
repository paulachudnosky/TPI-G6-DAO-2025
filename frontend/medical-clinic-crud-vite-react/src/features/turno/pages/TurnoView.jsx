import React from 'react';

const TurnoView = () => {
    // Sample data for demonstration
    const turno = {
        id: 1,
        paciente: 'Juan Perez',
        medico: 'Dr. Smith',
        fecha: '2023-10-01',
        hora: '10:00 AM',
        tipoConsulta: 'Consulta General',
    };

    return (
        <div>
            <h1>Detalles del Turno</h1>
            <p><strong>ID:</strong> {turno.id}</p>
            <p><strong>Paciente:</strong> {turno.paciente}</p>
            <p><strong>Médico:</strong> {turno.medico}</p>
            <p><strong>Fecha:</strong> {turno.fecha}</p>
            <p><strong>Hora:</strong> {turno.hora}</p>
            <p><strong>Tipo de Consulta:</strong> {turno.tipoConsulta}</p>
        </div>
    );
};

export default TurnoView;