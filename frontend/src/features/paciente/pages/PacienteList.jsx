import React, { useEffect, useState } from 'react';
import { getPacientes, updatePaciente } from '../services/pacienteService';
import { useNavigate } from 'react-router-dom';
import ToggleFilter from '../../../components/common/ToggleFilter';
import '../styles/paciente.css';

const PacienteList = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [showInactive, setShowInactive] = useState(false); // Estado para el toggle
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Máximo 10 ítems por página
    const navigate = useNavigate();

    const loadPacientes = async () => {
        setLoading(true);
        try {
            const data = await getPacientes(showInactive);
            setPacientes(data);
        } catch (err) {
            setError('Error al cargar los pacientes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPacientes();
    }, [showInactive]); // Recargar cuando cambia el estado del toggle

    const handleToggleActive = async (paciente) => {
        const action = paciente.activo ? 'desactivar' : 'reactivar';
        const confirmationMessage = `¿Está seguro de que desea ${action} a este paciente?`;

        if (!window.confirm(confirmationMessage)) return;

        try {
            // Para cambiar el estado, solo necesitamos invertir el valor de 'activo'
            const updatedPaciente = { ...paciente, activo: !paciente.activo };
            await updatePaciente(paciente.id_paciente, updatedPaciente);

            alert(`✅ Paciente ${action === 'reactivar' ? 'reactivado' : 'desactivado'} exitosamente`);
            loadPacientes(); // Recargar la lista
        } catch (err) {
            const errorMessage = err.response?.data?.error || `Error al ${action} al paciente.`;
            if (err.response?.status === 409) {
                alert(`⚠️ No se puede ${action}: ${errorMessage}`);
            } else {
                alert(`❌ ${errorMessage}`);
            }
        }
    };

    // Filtrar pacientes según el término de búsqueda
    const filteredPacientes = pacientes.filter(paciente =>
        paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paciente.dni.toString().includes(searchTerm)
    );

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPacientes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPacientes.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) return <div className="entity-loading">Cargando pacientes...</div>;
    if (error) return <div className="entity-alert entity-alert-danger">{error}</div>;

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>Gestión de Pacientes</h2>
                <div className="entity-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o DNI..."
                        className="entity-form-input"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        style={{ width: '300px' }}
                    />
                    <ToggleFilter
                        isChecked={showInactive}
                        onChange={() => {
                            setShowInactive(!showInactive);
                            setCurrentPage(1);
                        }}
                        labelOn="Mostrando Inactivos"
                        labelOff="Incluir Inactivos"
                    />
                    <button className="btn-entity-primary" onClick={() => navigate('/pacientes/nuevo')}>
                        ➕ Nuevo Paciente
                    </button>
                </div>
            </div>

            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>Nombre Completo</th>
                            <th>DNI</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No se encontraron pacientes con ese criterio.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map(paciente => (
                                <tr key={paciente.id_paciente} className={!paciente.activo ? 'inactive-row' : ''}>
                                    <td>{`${paciente.nombre} ${paciente.apellido}`}</td>
                                    <td>{paciente.dni}</td>
                                    <td>{paciente.email || <span className="entity-text-muted">N/A</span>}</td>
                                    <td>{paciente.telefono || <span className="entity-text-muted">N/A</span>}</td>
                                    <td>
                                        <span className={`entity-badge ${paciente.activo ? 'entity-badge-success' : 'entity-badge-secondary'}`}>
                                            {paciente.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="btn-entity-primary btn-entity-sm" onClick={() => navigate(`/pacientes/${paciente.id_paciente}`)} title="Ver Detalles">
                                            👁️ Ver
                                        </button>
                                        <button className="btn-entity-secondary btn-entity-sm" onClick={() => navigate(`/pacientes/${paciente.id_paciente}/editar`)} title="Editar">
                                            ✏️ Editar
                                        </button>
                                        <button className={`btn-entity-sm ${paciente.activo ? 'btn-entity-danger' : 'btn-entity-success'}`} onClick={() => handleToggleActive(paciente)} title={paciente.activo ? 'Desactivar' : 'Reactivar'}>
                                            {paciente.activo ? '🗑️ Desactivar' : '🔄 Reactivar'}
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

export default PacienteList;