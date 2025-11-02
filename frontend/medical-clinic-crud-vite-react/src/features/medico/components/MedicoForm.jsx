import React, { useEffect, useState } from 'react';
import '../styles/medico.css';

const MedicoForm = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        matricula: '',
        email: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                apellido: initialData.apellido || '',
                matricula: initialData.matricula || '',
                email: initialData.email || ''
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
        onSubmit(formData);
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit}>
            <div className="entity-form-group">
                <label htmlFor="nombre" className="entity-form-label required">
                    Nombre
                </label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="entity-form-input"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese el nombre del médico"
                />
            </div>

            <div className="entity-form-group">
                <label htmlFor="apellido" className="entity-form-label required">
                    Apellido
                </label>
                <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    className="entity-form-input"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese el apellido del médico"
                />
            </div>

            <div className="entity-form-group">
                <label htmlFor="matricula" className="entity-form-label required">
                    Matrícula
                </label>
                <input
                    type="text"
                    id="matricula"
                    name="matricula"
                    className="entity-form-input"
                    value={formData.matricula}
                    onChange={handleChange}
                    required
                    placeholder="Ej: MP12345"
                />
                <span className="entity-form-help">
                    Ingrese la matrícula profesional del médico
                </span>
            </div>

            <div className="entity-form-group">
                <label htmlFor="email" className="entity-form-label">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="entity-form-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="medico@ejemplo.com"
                />
                <span className="entity-form-help">
                    Correo electrónico de contacto (opcional)
                </span>
            </div>

            <div className="entity-form-actions">
                <button type="submit" className="btn-entity-primary">
                    💾 Guardar Médico
                </button>
            </div>
        </form>
    );
};

export default MedicoForm;