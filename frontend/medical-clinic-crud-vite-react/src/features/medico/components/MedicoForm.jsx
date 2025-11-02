import React, { useEffect, useState } from 'react';
import { getEspecialidades } from '../../especialidad/services/especialidadService';
import '../styles/medico.css';

const MedicoForm = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        matricula: '',
        email: '',
        id_especialidad: ''
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
                id_especialidad: initialData.id_especialidad || ''
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