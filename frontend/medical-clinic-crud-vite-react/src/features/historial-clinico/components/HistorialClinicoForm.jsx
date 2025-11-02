import React, { useState } from 'react';

const HistorialClinicoForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        pacienteId: '',
        medicoId: '',
        fecha: '',
        sintomas: '',
        diagnostico: '',
        tratamiento: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="pacienteId">Paciente ID:</label>
                <input
                    type="text"
                    id="pacienteId"
                    name="pacienteId"
                    value={formData.pacienteId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="medicoId">Medico ID:</label>
                <input
                    type="text"
                    id="medicoId"
                    name="medicoId"
                    value={formData.medicoId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="fecha">Fecha:</label>
                <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="sintomas">Síntomas:</label>
                <textarea
                    id="sintomas"
                    name="sintomas"
                    value={formData.sintomas}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="diagnostico">Diagnóstico:</label>
                <textarea
                    id="diagnostico"
                    name="diagnostico"
                    value={formData.diagnostico}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="tratamiento">Tratamiento:</label>
                <textarea
                    id="tratamiento"
                    name="tratamiento"
                    value={formData.tratamiento}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Guardar</button>
        </form>
    );
};

export default HistorialClinicoForm;