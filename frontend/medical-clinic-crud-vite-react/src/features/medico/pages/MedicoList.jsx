import React, { useEffect, useState } from 'react';
import { getMedicos, deleteMedico } from '../services/medicoService';
import { useNavigate } from 'react-router-dom';
import '../styles/medico.css';

const MedicoList = () => {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMedicos();
            setMedicos(data);
        } catch (err) {
            setError('Error al cargar los médicos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este médico?')) return;

        try {
            await deleteMedico(id);
            await load();
        } catch (err) {
            alert('Error al eliminar médico');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="entity-loading">Cargando médicos...</div>;
    }

    if (error) {
        return <div className="entity-alert entity-alert-danger">{error}</div>;
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Gestión de Médicos</h2>
                <button className="btn-entity-primary" onClick={() => navigate('/medico/nuevo')}>
                    ➕ Nuevo Médico
                </button>
            </div>

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Matrícula</th>
                            <th>Email</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicos.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No hay médicos registrados
                                </td>
                            </tr>
                        ) : (
                            medicos.map(m => (
                                <tr key={m.id_medico}>
                                    <td>{m.id_medico}</td>
                                    <td>{m.nombre}</td>
                                    <td>{m.apellido}</td>
                                    <td>{m.matricula}</td>
                                    <td>{m.email || <span className="entity-text-muted">Sin email</span>}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-entity-primary btn-entity-sm"
                                            onClick={() => navigate(`/medico/${m.id_medico}`)}
                                            title="Ver detalle"
                                        >
                                            👁️ Ver
                                        </button>
                                        <button
                                            className="btn-entity-secondary btn-entity-sm"
                                            onClick={() => navigate(`/medico/${m.id_medico}/editar`)}
                                            title="Editar"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn-entity-danger btn-entity-sm"
                                            onClick={() => onDelete(m.id_medico)}
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

export default MedicoList;