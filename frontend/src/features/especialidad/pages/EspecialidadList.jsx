import React, { useEffect, useState } from 'react';
import { getEspecialidades, updateEspecialidad } from '../services/especialidadService';
import { useNavigate } from 'react-router-dom';
import ToggleFilter from '../../../components/common/ToggleFilter';
import '../styles/especialidad.css';

const EspecialidadList = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInactive, setShowInactive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Puedes ajustar este número
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEspecialidades(showInactive);
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
    }, [showInactive]);

    const handleToggleActive = async (especialidad) => {
        const action = especialidad.activo ? 'desactivar' : 'reactivar';
        const confirmationMessage = `¿Está seguro de que desea ${action} esta especialidad?`;

        if (!window.confirm(confirmationMessage)) return;

        try {
            // Para cambiar el estado, solo necesitamos invertir el valor de 'activo'
            const updatedEspecialidad = { ...especialidad, activo: !especialidad.activo };
            await updateEspecialidad(especialidad.id_especialidad, updatedEspecialidad);

            alert(`✅ Especialidad ${action === 'reactivar' ? 'reactivada' : 'desactivada'} exitosamente`);
            load(); // Recargar la lista
        } catch (err) {
            const errorMessage = err.response?.data?.error || `Error al ${action} la especialidad.`;
            if (err.response?.status === 409) {
                alert(`⚠️ No se puede ${action}: ${errorMessage}`);
            } else {
                alert(`❌ ${errorMessage}`);
            }
        }
    };

    // Filtrar y paginar especialidades
    const filteredEspecialidades = especialidades.filter(e =>
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEspecialidades.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEspecialidades.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
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
                <div className="entity-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="entity-form-input"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        style={{ width: '250px' }} // Ancho fijo para la búsqueda
                    />
                    <ToggleFilter
                        isChecked={showInactive}
                        onChange={() => setShowInactive(!showInactive)}
                        labelOn="Mostrando Inactivas"
                        labelOff="Incluir Inactivas"
                    />
                    <button className="btn-entity-primary" onClick={() => navigate('/especialidad/nuevo')}>
                        ➕ Nueva Especialidad
                    </button>
                </div>
            </div>

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="empty-state">
                                    No se encontraron especialidades con ese criterio.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map(e => (
                                <tr key={e.id_especialidad}>
                                    <td>{e.nombre}</td>
                                    <td>{e.descripcion || <span className="entity-text-muted">Sin descripción</span>}</td>
                                    <td>
                                        <span className={`entity-badge ${e.activo ? 'entity-badge-success' : 'entity-badge-secondary'}`}>
                                            {e.activo ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
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
                                        <button className={`btn-entity-sm ${e.activo ? 'btn-entity-danger' : 'btn-entity-success'}`} onClick={() => handleToggleActive(e)} title={e.activo ? 'Desactivar' : 'Reactivar'}>
                                            {e.activo ? '🗑️ Desactivar' : '🔄 Reactivar'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination-container">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn-entity-secondary btn-entity-sm"
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn-entity-secondary btn-entity-sm"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default EspecialidadList;