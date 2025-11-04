import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tipoMedicamentoService from '../services/tipoMedicamentoService';

const TipoMedicamentoForm = ({ tipoMedicamentoId }) => {
    const [tipoMedicamento, setTipoMedicamento] = useState({ nombre: '', descripcion: '' });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (tipoMedicamentoId) {
            setIsEditing(true);
            const fetchTipoMedicamento = async () => {
                const data = await tipoMedicamentoService.getTipoMedicamentoById(tipoMedicamentoId);
                setTipoMedicamento(data);
            };
            fetchTipoMedicamento();
        }
    }, [tipoMedicamentoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTipoMedicamento({ ...tipoMedicamento, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await tipoMedicamentoService.updateTipoMedicamento(tipoMedicamentoId, tipoMedicamento);
        } else {
            await tipoMedicamentoService.createTipoMedicamento(tipoMedicamento);
        }
        navigate('/tipo-medicamento');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={tipoMedicamento.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={tipoMedicamento.descripcion}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default TipoMedicamentoForm;