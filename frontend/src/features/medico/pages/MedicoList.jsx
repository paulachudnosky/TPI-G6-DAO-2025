import React, { useEffect, useState } from 'react';
import { getMedicos, setMedicoStatus } from '../services/medicoService';
import { useNavigate } from 'react-router-dom';
import '../styles/medico.css';
import ToggleFilter from '../../../components/common/ToggleFilter'; // Importamos desde la nueva ubicación

const MedicoList = () => {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInactive, setShowInactive] = useState(false); // 1. Nuevo estado para mostrar inactivos
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Máximo 10 ítems por página
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            // El servicio getMedicos ya trae todos (activos e inactivos)
            // El filtrado se hace en el frontend
            const data = await getMedicos(true); // Pedimos todos los médicos
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
    }, []); // Se carga solo una vez al montar el componente

    const handleToggleStatus = async (medico) => {
        const actionText = medico.activo ? 'desactivar' : 'activar';
        if (!window.confirm(`¿Está seguro de ${actionText} este médico?`)) return;

        try {
            await setMedicoStatus(medico.id_medico, !medico.activo);
            alert(`✅ Médico ${actionText}do exitosamente`);
            await load();
        } catch (err) {
            const errorMessage = err.response?.data?.error || `Error al ${actionText} el médico.`;
            alert(`❌ ${errorMessage}`);
            console.error(err);
        }
    };

    if (loading) {
        return <div className="entity-loading">Cargando médicos...</div>;
    }

    if (error) {
        return <div className="entity-alert entity-alert-danger">{error}</div>;
    }

    // Lógica de paginación
    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // 2. Filtramos los médicos según el estado del interruptor y el término de búsqueda
    const filteredMedicos = medicos
        .filter(medico => {
            // Filtro por estado (activo/inactivo)
            return showInactive ? true : medico.activo;
        })
        .filter(medico => {
            // Filtro por término de búsqueda
            const fullName = `${medico.nombre} ${medico.apellido}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        });

    // Aplicar paginación a los resultados filtrados
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMedicos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMedicos.length / itemsPerPage);

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Gestión de Médicos</h2>
                <div className="entity-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o apellido..."
                        className="entity-form-input"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        style={{ width: '250px' }}
                    />
                    <ToggleFilter
                        isChecked={showInactive}
                        onChange={() => setShowInactive(!showInactive)}
                        labelOn="Mostrando Inactivos"
                        labelOff="Incluir Inactivos"
                    />
                    <button className="btn-entity-primary" onClick={() => navigate('/medico/nuevo')}>
                        ➕ Nuevo Médico
                    </button>
                </div>
            </div>

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>Nombre Completo</th>
                            <th>Matrícula</th>
                            <th>Especialidad</th>
                            <th>Email</th>
                            <th>Estado</th>
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
                        ) : currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">No se encontraron médicos con ese criterio.</td>
                            </tr>
                        ) : (
                            currentItems.map(medico => (
                                <tr key={medico.id_medico} className={!medico.activo ? 'inactive-row' : ''}>
                                    <td>{`${medico.nombre} ${medico.apellido}`}</td>
                                    <td>{medico.matricula}</td>
                                    <td>
                                        <span className="entity-badge entity-badge-success">
                                            {medico.especialidad_nombre || 'Sin especialidad'}
                                        </span>
                                    </td>
                                    <td>{medico.email || <span className="entity-text-muted">Sin email</span>}</td>
                                    <td>
                                        <span className={`entity-badge ${medico.activo ? 'entity-badge-success' : 'entity-badge-danger'}`}>
                                            {medico.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-entity-primary btn-entity-sm"
                                            onClick={() => navigate(`/medico/${medico.id_medico}`)}
                                            title="Ver detalle"
                                        >
                                            👁️ Ver
                                        </button>
                                        <button
                                            className="btn-entity-secondary btn-entity-sm"
                                            onClick={() => navigate(`/medico/${medico.id_medico}/editar`)}
                                            title="Editar"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className={`btn-entity-sm ${medico.activo ? 'btn-entity-danger' : 'btn-entity-success'}`}
                                            onClick={() => handleToggleStatus(medico)}
                                            title={medico.activo ? 'Desactivar' : 'Activar'}
                                        >
                                            {medico.activo ? '🗑️ Desactivar' : '🔄 Activar'}
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

export default MedicoList;