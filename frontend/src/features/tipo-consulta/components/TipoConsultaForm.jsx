import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tipoConsultaService from '../services/tipoConsultaService';

const TipoConsultaForm = ({ tipoConsultaId }) => {
    const [tipoConsulta, setTipoConsulta] = useState({ nombre: '' });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (tipoConsultaId) {
            setIsEditing(true);
            const fetchTipoConsulta = async () => {
                const data = await tipoConsultaService.getTipoConsultaById(tipoConsultaId);
                setTipoConsulta(data);
            };
            fetchTipoConsulta();
        }
    }, [tipoConsultaId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTipoConsulta({ ...tipoConsulta, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await tipoConsultaService.updateTipoConsulta(tipoConsultaId, tipoConsulta);
        } else {
            await tipoConsultaService.createTipoConsulta(tipoConsulta);
        }
        navigate('/tipo-consulta');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={tipoConsulta.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</button>
        </form>
    );
};

export default TipoConsultaForm;