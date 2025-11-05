import React, { useState, useEffect } from 'react';

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const HorarioAtencionForm = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        dia_semana: initialData?.dia_semana || 'Lunes',
        hora_inicio: initialData?.hora_inicio || '09:00',
        hora_fin: initialData?.hora_fin || '17:00',
        id_medico: initialData?.id_medico || null
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const validate = () => {
            const newErrors = {};
            // Validación de la hora de fin
            if (formData.hora_inicio && formData.hora_fin && formData.hora_inicio >= formData.hora_fin) {
                newErrors.hora_fin = 'La hora de fin debe ser posterior a la hora de inicio.';
            }
            setErrors(newErrors);
        };
        validate();
    }, [formData]); // Se ejecuta cada vez que cambia el formulario

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // No permitir el envío si hay errores
        if (Object.keys(errors).length > 0) {
            alert("Por favor, corrija los errores antes de guardar.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
            <div className="entity-form-group">
                <label htmlFor="dia_semana" className="entity-form-label required">Día de la Semana</label>
                <select id="dia_semana" name="dia_semana" value={formData.dia_semana} onChange={handleChange} className="entity-form-input" required >
                    {DIAS_SEMANA.map(dia => <option key={dia} value={dia}>{dia}</option>)}
                </select>
            </div>
            <div className="entity-form-group">
                <label htmlFor="hora_inicio" className="entity-form-label required">Hora Inicio</label>
                <input id="hora_inicio" type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange} className="entity-form-input" required/>
            </div>
            <div className="entity-form-group">
                <label htmlFor="hora_fin" className="entity-form-label required">Hora Fin</label>
                <input 
                    id="hora_fin" 
                    type="time" 
                    name="hora_fin" 
                    value={formData.hora_fin} 
                    onChange={handleChange} 
                    className={`entity-form-input ${errors.hora_fin ? 'is-invalid' : ''}`} 
                    required 
                />
                {errors.hora_fin && <div className="entity-form-error">{errors.hora_fin}</div>}
            </div>
            <div className="entity-form-actions">
                <button type="submit" className="btn-entity-primary" disabled={Object.keys(errors).length > 0}>
                    💾 Guardar Horario
                </button>
            </div>
        </form>
    );
};

export default HorarioAtencionForm;

/* 
   NOTA: Para que los estilos de error funcionen, asegúrate de que tu archivo
   `entity-base.css` contenga estas clases o añádelas:

   .is-invalid {
       border-color: #dc3545; // Rojo
   }

   .entity-form-error {
       color: #dc3545; // Rojo
       font-size: 0.875em;
       margin-top: 0.25rem;
   }
*/