import React, { useEffect, useState } from 'react';
import { getEspecialidades, deleteEspecialidad } from '../services/especialidadService';
import { useNavigate } from 'react-router-dom';
import '../styles/especialidad.css';

const EspecialidadList = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEspecialidades();
            setEspecialidades(data);
        } catch (err) {
            setError('Error al cargar las especialidades');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar esta especialidad?')) return;

        try {
            await deleteEspecialidad(id);
            await load();
        } catch (err) {
            alert('Error al eliminar especialidad');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="entity-loading">Cargando especialidades...</div>;
    }

    if (error) {
        return <div className="entity-alert entity-alert-danger">{error}</div>;
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Gestión de Especialidades</h2>
                <button className="btn-entity-primary" onClick={() => navigate('/especialidad/nuevo')}>
                    ➕ Nueva Especialidad
                </button>
            </div>

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {especialidades.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="empty-state">
                                    No hay especialidades registradas
                                </td>
                            </tr>
                        ) : (
                            especialidades.map(e => (
                                <tr key={e.id_especialidad}>
                                    <td>{e.id_especialidad}</td>
                                    <td>{e.nombre}</td>
                                    <td>{e.descripcion || <span className="entity-text-muted">Sin descripción</span>}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-entity-primary btn-entity-sm"
                                            onClick={() => navigate(`/especialidad/${e.id_especialidad}`)}
                                            title="Ver detalle"
                                        >
                                            👁️ Ver
                                        </button>
                                        <button
                                            className="btn-entity-secondary btn-entity-sm"
                                            onClick={() => navigate(`/especialidad/${e.id_especialidad}/editar`)}
                                            title="Editar"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn-entity-danger btn-entity-sm"
                                            onClick={() => onDelete(e.id_especialidad)}
                                            title="Eliminar"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EspecialidadList;