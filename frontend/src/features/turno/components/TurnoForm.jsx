import React, { useState, useEffect } from 'react';

const TurnoForm = ({ turno, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        fecha: '',
        hora: '',
        pacienteId: '',
        medicoId: '',
        especialidadId: '',
    });

    useEffect(() => {
        if (turno) {
            setFormData({
                fecha: turno.fecha,
                hora: turno.hora,
                pacienteId: turno.pacienteId,
                medicoId: turno.medicoId,
                especialidadId: turno.especialidadId,
            });
        }
    }, [turno]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Fecha:</label>
                <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Hora:</label>
                <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Paciente ID:</label>
                <input
                    type="text"
                    name="pacienteId"
                    value={formData.pacienteId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Médico ID:</label>
                <input
                    type="text"
                    name="medicoId"
                    value={formData.medicoId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Especialidad ID:</label>
                <input
                    type="text"
                    name="especialidadId"
                    value={formData.especialidadId}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
};

export default TurnoForm;