import React, { useState, useEffect } from 'react';
import '../styles/especialidad.css';

const EspecialidadForm = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                descripcion: initialData.descripcion || ''
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
                    placeholder="Ingrese el nombre de la especialidad"
                />
            </div>

            <div className="entity-form-group">
                <label htmlFor="descripcion" className="entity-form-label required">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    className="entity-form-input"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese la descripción de la especialidad"
                    rows="4"
                />
                <span className="entity-form-help">
                    Describa brevemente esta especialidad médica
                </span>
            </div>

            <div className="entity-form-actions">
                <button type="submit" className="btn-entity-primary">
                    Guardar Especialidad
                </button>
            </div>
        </form>
    );
};

export default EspecialidadForm;
