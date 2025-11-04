import React, { useState, useEffect } from 'react';

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const HorarioAtencionForm = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        dia_semana: 'Lunes',
        hora_inicio: '09:00',
        hora_fin: '17:00',
        id_medico: null
    });

    useEffect(() => {
        if (initialData) {
            // Aseguramos que todos los campos, incluido id_medico, se establezcan
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
            <div className="entity-form-group">
                <label htmlFor="dia_semana" className="entity-form-label required">Día de la Semana</label>
                <select id="dia_semana" name="dia_semana" value={formData.dia_semana} onChange={handleChange} className="entity-form-input" required>
                    {DIAS_SEMANA.map(dia => <option key={dia} value={dia}>{dia}</option>)}
                </select>
            </div>
            <div className="entity-form-group">
                <label htmlFor="hora_inicio" className="entity-form-label required">Hora Inicio</label>
                <input id="hora_inicio" type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange} className="entity-form-input" required />
            </div>
            <div className="entity-form-group">
                <label htmlFor="hora_fin" className="entity-form-label required">Hora Fin</label>
                <input id="hora_fin" type="time" name="hora_fin" value={formData.hora_fin} onChange={handleChange} className="entity-form-input" required />
            </div>
            <div className="entity-form-actions">
                <button type="submit" className="btn-entity-primary">
                    💾 Guardar Horario
                </button>
            </div>
        </form>
    );
};

export default HorarioAtencionForm;