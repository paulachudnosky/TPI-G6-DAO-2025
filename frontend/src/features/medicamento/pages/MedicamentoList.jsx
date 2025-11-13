import React, { useEffect, useState } from 'react';
import { getMedicamentos, deleteMedicamento } from '../services/medicamentoService';
import { useNavigate } from 'react-router-dom';
// import '../styles/medicamento.css'; // O importa el de especialidad si es compartido

const MedicamentoList = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMedicamentos();
            setMedicamentos(data);
        } catch (err) {
            setError('Error al cargar los medicamentos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este medicamento?')) return;

        try {
            await deleteMedicamento(id);
            alert('✅ Medicamento eliminado exitosamente');
            await load();
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error desconocido';
            if (err.response?.status === 409 || errorMessage.includes('en uso')) {
                alert('⚠️ No se puede eliminar este medicamento porque está en uso (ej. en recetas).');
            } else {
                alert('❌ Error al eliminar medicamento: ' + errorMessage);
            }
            console.error(err);
        }
    };

    if (loading) {
        return <div className="entity-loading">Cargando medicamentos...</div>;
    }

    if (error) {
        return <div className="entity-alert entity-alert-danger">{error}</div>;
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Gestión de Medicamentos</h2>
                <button className="btn-entity-primary" onClick={() => navigate('/medicamento/nuevo')}>
                    ➕ Nuevo Medicamento
                </button>
            </div>

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Código Nacional</th>
                            <th>Presentación</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicamentos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    No hay medicamentos registrados
                                </td>
                            </tr>
                        ) : (
                            medicamentos.map(m => (
                                <tr key={m.id_medicamento}>
                                    <td>{m.id_medicamento}</td>
                                    <td>{m.nombre}</td>
                                    <td>{m.codigo_nacional || <span className="entity-text-muted">N/A</span>}</td>
                                    <td>{m.presentacion || <span className="entity-text-muted">N/A</span>}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-entity-primary btn-entity-sm"
                                            onClick={() => navigate(`/medicamento/${m.id_medicamento}`)}
                                            title="Ver detalle"
                                        >
                                            👁️ Ver
                                        </button>
                                        <button
                                            className="btn-entity-secondary btn-entity-sm"
                                            onClick={() => navigate(`/medicamento/${m.id_medicamento}/editar`)}
                                            title="Editar"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn-entity-danger btn-entity-sm"
                                            onClick={() => onDelete(m.id_medicamento)}
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

export default MedicamentoList;