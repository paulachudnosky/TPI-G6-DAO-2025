import React, { useState, useEffect } from 'react';
// Asumo que los estilos están en una ruta similar a 'especialidad.css'
// Si no, puedes importar '../styles/especialidad.css' directamente
// import '../styles/medicamento.css'; 

const MedicamentoForm = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        id_tipo_medicamento: '',
        codigo_nacional: '',
        forma_farmaceutica: '',
        presentacion: ''
    });

    // NOTA: Carga de Tipos de Medicamento (para el <select>)
    // Aquí deberías cargar los tipos de medicamento (como hiciste en mi código anterior)
    // const [tipos, setTipos] = useState([]);
    // useEffect(() => { /* fetch tipos */ }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                descripcion: initialData.descripcion || '',
                id_tipo_medicamento: initialData.id_tipo_medicamento || '',
                codigo_nacional: initialData.codigo_nacional || '',
                forma_farmaceutica: initialData.forma_farmaceutica || '',
                presentacion: initialData.presentacion || ''
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
            
            {/* Fila 1: Nombre y Código Nacional */}
            <div className="entity-form-row">
                <div className="entity-form-group">
                    <label htmlFor="nombre" className="entity-form-label required">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="entity-form-input"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Paracetamol 500mg"
                    />
                </div>
                <div className="entity-form-group">
                    <label htmlFor="codigo_nacional" className="entity-form-label required">Código Nacional</label>
                    <input
                        type="text"
                        id="codigo_nacional"
                        name="codigo_nacional"
                        className="entity-form-input"
                        value={formData.codigo_nacional}
                        onChange={handleChange}
                        required
                        placeholder="Ej: 123456.7"
                    />
                </div>
            </div>

            {/* Fila 2: Tipo y Forma Farmacéutica */}
            <div className="entity-form-row">
                <div className="entity-form-group">
                    <label htmlFor="id_tipo_medicamento" className="entity-form-label required">Tipo Medicamento</label>
                    {/* TODO: Cambiar por un <select> cuando tengas el servicio de tipos */}
                    <input
                        type="number" // Temporal. Idealmente un <select>
                        id="id_tipo_medicamento"
                        name="id_tipo_medicamento"
                        className="entity-form-input"
                        value={formData.id_tipo_medicamento}
                        onChange={handleChange}
                        required
                        placeholder="ID del Tipo (Ej: 1)"
                    />
                </div>
                <div className="entity-form-group">
                    <label htmlFor="forma_farmaceutica" className="entity-form-label">Forma Farmacéutica</label>
                    <input
                        type="text"
                        id="forma_farmaceutica"
                        name="forma_farmaceutica"
                        className="entity-form-input"
                        value={formData.forma_farmaceutica}
                        onChange={handleChange}
                        placeholder="Ej: Comprimido"
                    />
                </div>
            </div>
            
            {/* Fila 3: Presentación */}
            <div className="entity-form-group">
                <label htmlFor="presentacion" className="entity-form-label">Presentación</label>
                <input
                    type="text"
                    id="presentacion"
                    name="presentacion"
                    className="entity-form-input"
                    value={formData.presentacion}
                    onChange={handleChange}
                    placeholder="Ej: Caja de 20 comprimidos"
                />
            </div>

            {/* Fila 4: Descripción */}
            <div className="entity-form-group">
                <label htmlFor="descripcion" className="entity-form-label">Descripción</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    className="entity-form-input"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Ingrese la descripción del medicamento"
                    rows="3"
                />
                <span className="entity-form-help">
                    Usos, advertencias, etc.
                </span>
            </div>

            <div className="entity-form-actions">
                <button type="submit" className="btn-entity-primary">
                    Guardar Medicamento
                </button>
            </div>
        </form>
    );
};

export default MedicamentoForm;