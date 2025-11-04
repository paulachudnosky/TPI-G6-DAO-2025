import React, { useState, useEffect } from 'react';

const HorarioAtencionForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        id: initialData ? initialData.id : '',
        dia: initialData ? initialData.dia : '',
        horaInicio: initialData ? initialData.horaInicio : '',
        horaFin: initialData ? initialData.horaFin : '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

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
                <label htmlFor="dia">Día:</label>
                <input
                    type="text"
                    id="dia"
                    name="dia"
                    value={formData.dia}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="horaInicio">Hora de Inicio:</label>
                <input
                    type="time"
                    id="horaInicio"
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="horaFin">Hora de Fin:</label>
                <input
                    type="time"
                    id="horaFin"
                    name="horaFin"
                    value={formData.horaFin}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Guardar</button>
        </form>
    );
};

export default HorarioAtencionForm;