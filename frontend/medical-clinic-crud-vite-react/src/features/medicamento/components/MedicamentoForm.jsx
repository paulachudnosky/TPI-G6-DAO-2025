import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import medicamentoService from '../services/medicamentoService';

const MedicamentoForm = ({ medicamentoId }) => {
    const [medicamento, setMedicamento] = useState({ nombre: '', descripcion: '', dosis: '' });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (medicamentoId) {
            setIsEditing(true);
            medicamentoService.getMedicamentoById(medicamentoId)
                .then(data => setMedicamento(data))
                .catch(error => console.error('Error fetching medicamento:', error));
        }
    }, [medicamentoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicamento({ ...medicamento, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            medicamentoService.updateMedicamento(medicamentoId, medicamento)
                .then(() => navigate('/medicamentos'))
                .catch(error => console.error('Error updating medicamento:', error));
        } else {
            medicamentoService.createMedicamento(medicamento)
                .then(() => navigate('/medicamentos'))
                .catch(error => console.error('Error creating medicamento:', error));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre:</label>
                <input type="text" name="nombre" value={medicamento.nombre} onChange={handleChange} required />
            </div>
            <div>
                <label>Descripción:</label>
                <textarea name="descripcion" value={medicamento.descripcion} onChange={handleChange} required />
            </div>
            <div>
                <label>Dosis:</label>
                <input type="text" name="dosis" value={medicamento.dosis} onChange={handleChange} required />
            </div>
            <button type="submit">{isEditing ? 'Actualizar' : 'Crear'} Medicamento</button>
        </form>
    );
};

export default MedicamentoForm;