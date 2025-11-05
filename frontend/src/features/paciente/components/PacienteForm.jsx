import React, { useState, useEffect } from 'react';

const PacienteForm = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        fecha_nacimiento: '',
        email: '',
        telefono: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                apellido: initialData.apellido || '',
                dni: initialData.dni || '',
                // Formatear la fecha para el input type="date"
                fecha_nacimiento: initialData.fecha_nacimiento ? initialData.fecha_nacimiento.split('T')[0] : '',
                email: initialData.email || '',
                telefono: initialData.telefono || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // --- VALIDACIONES DEL LADO DEL CLIENTE ---
        const { dni, fecha_nacimiento, telefono } = formData;

        // 1. Validación de DNI (numérico, 7 u 8 dígitos)
        const dniRegex = /^\d{7,8}$/;
        if (!dniRegex.test(dni)) {
            alert('❌ El DNI debe ser un número de 7 u 8 dígitos.');
            return; // Detiene el envío del formulario
        }

        // 2. Validación de Teléfono (opcional, pero si existe, no debe contener letras)
        const telefonoRegex = /^[0-9+\-()\s]*$/;
        if (telefono && !telefonoRegex.test(telefono)) {
            alert('❌ El teléfono solo puede contener números y los símbolos +, -, ( ).');
            return; // Detiene el envío del formulario
        }

        // 3. Validación de Fecha de Nacimiento
        if (fecha_nacimiento) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación

            const minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 120);
            minDate.setHours(0, 0, 0, 0);

            // El valor del input 'date' es 'YYYY-MM-DD'. Para evitar problemas de zona horaria,
            // creamos la fecha de esta manera.
            const parts = fecha_nacimiento.split('-');
            const selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);

            if (selectedDate > today) {
                alert('❌ La fecha de nacimiento no puede ser una fecha futura.');
                return; // Detiene el envío del formulario
            }
            if (selectedDate < minDate) {
                alert('❌ La fecha de nacimiento no puede ser de hace más de 120 años.');
                return; // Detiene el envío del formulario
            }
        }

        onSubmit(formData);
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit}>
            <div className="entity-form-group">
                <label htmlFor="nombre" className="entity-form-label required">Nombre</label>
                <input type="text" id="nombre" name="nombre" className="entity-form-input" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="entity-form-group">
                <label htmlFor="apellido" className="entity-form-label required">Apellido</label>
                <input type="text" id="apellido" name="apellido" className="entity-form-input" value={formData.apellido} onChange={handleChange} required />
            </div>
            <div className="entity-form-group">
                <label htmlFor="dni" className="entity-form-label required">DNI</label>
                <input type="text" id="dni" name="dni" className="entity-form-input" value={formData.dni} onChange={handleChange} required />
            </div>
            <div className="entity-form-group">
                <label htmlFor="fecha_nacimiento" className="entity-form-label required">Fecha de Nacimiento</label>
                <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" className="entity-form-input" value={formData.fecha_nacimiento} onChange={handleChange} required />
            </div>
            <div className="entity-form-group">
                <label htmlFor="email" className="entity-form-label">Email</label>
                <input type="email" id="email" name="email" className="entity-form-input" value={formData.email} onChange={handleChange} />
            </div>
            <div className="entity-form-group">
                <label htmlFor="telefono" className="entity-form-label">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" className="entity-form-input" value={formData.telefono} onChange={handleChange} />
            </div>
            <div className="entity-form-actions">
                <button type="submit" className="btn-entity-primary">
                    💾 Guardar Paciente
                </button>
            </div>
        </form>
    );
};

export default PacienteForm;