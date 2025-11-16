import React, { useEffect, useState } from 'react';
import { getEspecialidades } from '../../especialidad/services/especialidadService';
import '../styles/medico.css';

const MedicoForm = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        matricula: '',
        email: '',
        id_especialidad: '',
        activo: true // 1. Añadimos el estado 'activo' por defecto a true
    });

    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEspecialidades();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                apellido: initialData.apellido || '',
                matricula: initialData.matricula || '',
                email: initialData.email || '',
                id_especialidad: initialData.id_especialidad || '',
                activo: initialData.activo !== undefined ? initialData.activo : true // 2. Manejamos el estado 'activo'
            });
        }
    }, [initialData]);

    const loadEspecialidades = async () => {
        try {
            const data = await getEspecialidades();
            setEspecialidades(data);
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
            alert('Error al cargar las especialidades');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // 3. Lógica para manejar tanto inputs normales como el checkbox/switch
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: val
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
                    maxLength="20"
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
                    maxLength="20"
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
                    minLength="4"
                    maxLength="15"
                    placeholder="Ej: MP-12345"
                />
                <span className="entity-form-help">
                    Ingrese la matrícula profesional del médico
                </span>
            </div>

            <div className="entity-form-group">
                <label htmlFor="id_especialidad" className="entity-form-label required">
                    Especialidad
                </label>
                <select
                    id="id_especialidad"
                    name="id_especialidad"
                    className="entity-form-input"
                    value={formData.id_especialidad}
                    onChange={handleChange}
                    required
                    disabled={loading}
                >
                    <option value="">Seleccione una especialidad...</option>
                    {especialidades.map(esp => (
                        <option key={esp.id_especialidad} value={esp.id_especialidad}>
                            {esp.nombre}
                        </option>
                    ))}
                </select>
                <span className="entity-form-help">
                    Seleccione la especialidad médica (obligatorio)
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
                    maxLength="100"
                    placeholder="medico@ejemplo.com"
                />
                <span className="entity-form-help">
                    Correo electrónico de contacto (opcional)
                </span>
            </div>

            {/* 4. Nuevo campo para el estado del médico (solo visible en modo edición) */}
            {initialData && (
                <div className="entity-form-group">
                    <label htmlFor="activo" className="entity-form-label">
                        Estado
                    </label>
                    <div className="entity-form-switch">
                        <input
                            type="checkbox"
                            id="activo"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleChange}
                            className="entity-form-switch-input"
                        />
                        <label htmlFor="activo" className="entity-form-switch-label"></label>
                        <span className="entity-form-switch-text">{formData.activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                </div>
            )}

            <div className="entity-form-actions">
                <button type="submit" className="btn-entity-primary">
                    💾 Guardar Médico
                </button>
            </div>
        </form>
    );
};

export default MedicoForm;