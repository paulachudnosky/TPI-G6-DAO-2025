import React, { useEffect, useState } from 'react';
import { getPacientes, deletePaciente } from '../services/pacienteService';
import { useNavigate } from 'react-router-dom';
import '../styles/paciente.css';

const PacienteList = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const navigate = useNavigate();

    const loadPacientes = async () => {
        setLoading(true);
        try {
            const data = await getPacientes();
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
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este paciente?')) return;

        try {
            await deletePaciente(id);
            alert('✅ Paciente eliminado exitosamente');
            loadPacientes(); // Recargar la lista
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al eliminar el paciente.';
            if (err.response?.status === 409) {
                alert(`⚠️ No se puede eliminar: ${errorMessage}`);
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

    if (loading) return <div className="entity-loading">Cargando pacientes...</div>;
    if (error) return <div className="entity-alert entity-alert-danger">{error}</div>;

    return (
        <div className="entity-container">
            <div className="entity-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Gestión de Pacientes</h2>
                <div className="entity-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o DNI..."
                        className="entity-form-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '300px' }}
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
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>DNI</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPacientes.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No se encontraron pacientes con ese criterio.
                                </td>
                            </tr>
                        ) : (
                            filteredPacientes.map(paciente => (
                                <tr key={paciente.id_paciente}>
                                    <td>{paciente.id_paciente}</td>
                                    <td>{`${paciente.nombre} ${paciente.apellido}`}</td>
                                    <td>{paciente.dni}</td>
                                    <td>{paciente.email || <span className="entity-text-muted">N/A</span>}</td>
                                    <td>{paciente.telefono || <span className="entity-text-muted">N/A</span>}</td>
                                    <td className="actions-cell">
                                        <button className="btn-entity-primary btn-entity-sm" onClick={() => navigate(`/pacientes/${paciente.id_paciente}`)} title="Ver">
                                            👁️
                                        </button>
                                        <button className="btn-entity-secondary btn-entity-sm" onClick={() => navigate(`/pacientes/${paciente.id_paciente}/editar`)} title="Editar">
                                            ✏️
                                        </button>
                                        <button className="btn-entity-danger btn-entity-sm" onClick={() => handleDelete(paciente.id_paciente)} title="Eliminar">
                                            🗑️
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

export default PacienteList;