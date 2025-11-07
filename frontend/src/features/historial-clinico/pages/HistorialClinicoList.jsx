import React, { useEffect, useState, useRef } from 'react'; // Importamos useRef
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importamos useSearchParams
import { getPacientes } from '../../paciente/services/pacienteService';
import { getConsultasPorPaciente } from '../../consulta/services/consultaService';
import '../styles/historial-clinico.css';

const HistorialClinicoList = () => {
    const [pacientes, setPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // Hook para manejar parámetros de URL

    // Ref para controlar si la búsqueda inicial desde la URL ya se realizó
    const initialSearchPerformed = useRef(false);

    // Efecto 1: Cargar la lista de pacientes para el selector
    useEffect(() => {
        const loadPacientes = async () => {
            try {
                const data = await getPacientes();
                setPacientes(data);
            } catch (err) {
                setError('Error al cargar la lista de pacientes.');
                console.error(err);
            }
        };
        loadPacientes();
    }, []); // Se ejecuta una sola vez al montar el componente

    // Efecto 2: Leer idPaciente de la URL y establecerlo como paciente seleccionado
    // Y realizar la búsqueda inicial si es necesario
    useEffect(() => {
        const pacienteIdFromUrl = searchParams.get('idPaciente');

        // Solo proceder si los pacientes ya están cargados y la búsqueda inicial no se ha hecho
        if (pacienteIdFromUrl && pacientes.length > 0 && !initialSearchPerformed.current) {
            const patientExists = pacientes.some(p => String(p.id_paciente) === pacienteIdFromUrl);
            if (patientExists) {
                setSelectedPaciente(pacienteIdFromUrl);
                // Disparar la búsqueda inicial
                handleSearch(pacienteIdFromUrl);
                initialSearchPerformed.current = true; // Marcar que ya se hizo la búsqueda inicial
            } else {
                // Si el ID de paciente de la URL no es válido, limpiar la URL y el estado
                setSearchParams({});
                setSelectedPaciente('');
                setConsultas([]); // Limpiar consultas si el paciente de la URL no existe
            }
        } else if (!pacienteIdFromUrl && initialSearchPerformed.current) {
            // Si no hay idPaciente en la URL pero ya se había hecho una búsqueda,
            // significa que el usuario borró el idPaciente de la URL o navegó sin él.
            // Limpiamos el estado.
            setSelectedPaciente('');
            setConsultas([]);
            initialSearchPerformed.current = false; // Resetear para futuras navegaciones
        }
    }, [pacientes, searchParams, setSearchParams]); // Se ejecuta cuando los pacientes o los parámetros de URL cambian

    // handleSearch ahora solo se llama explícitamente
    const handleSearch = async (pacienteIdToSearch = selectedPaciente) => { // Usa selectedPaciente por defecto
        if (!pacienteIdToSearch) {
            alert('Por favor, seleccione un paciente.');
            setConsultas([]);
            setSearchParams({});
            return;
        }
        setLoading(true);
        setError(null);
        setConsultas([]); // Limpiar resultados anteriores
        try {
            const data = await getConsultasPorPaciente(pacienteIdToSearch); // Usa el ID pasado o el seleccionado
            setConsultas(data);
            setSearchParams({ idPaciente: pacienteIdToSearch }); // Actualizar la URL con el ID del paciente
        } catch (err) {
            setError('Error al buscar las consultas del paciente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePacienteChange = (e) => {
        setSelectedPaciente(e.target.value);
        // NO llamamos a handleSearch aquí. Se llamará solo con el botón.
    };

    // Función para formatear la fecha
    const formatFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>📋 Historial de Consultas por Paciente</h2>
            </div>

            {/* Filtro de Búsqueda */}
            <div className="entity-form" style={{ marginBottom: '2rem' }}>
                <div className="entity-form-group">
                    <label htmlFor="paciente-select" className="entity-form-label">Seleccione un Paciente</label>
                    <select
                        id="paciente-select"
                        className="entity-form-input"
                        value={selectedPaciente}
                        onChange={handlePacienteChange}
                    >
                        <option value="">-- Seleccionar --</option>
                        {pacientes.map(p => (
                            <option key={p.id_paciente} value={p.id_paciente}>
                                {p.apellido}, {p.nombre} (DNI: {p.dni})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="entity-form-actions" style={{ justifyContent: 'center' }}> {/* Botón Buscar */}
                    <button
                        className="btn-entity-primary"
                        onClick={() => handleSearch()} // Llama a handleSearch al hacer clic
                        disabled={loading || !selectedPaciente} // Deshabilita si está cargando o no hay paciente seleccionado
                    >
                        {loading ? 'Buscando...' : '🔍 Buscar Historial'}
                    </button>
                </div>
            </div>

            {error && <div className="entity-alert entity-alert-danger">{error}</div>}

            {/* Tabla de Resultados */}
            <div className="entity-table-container">
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Médico</th>
                            <th>Motivo de la Consulta</th>
                            <th>Observaciones</th>
                            <th className="actions-cell">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="entity-loading">Cargando...</td></tr> 
                        ) : (selectedPaciente && consultas.length === 0 && initialSearchPerformed.current) ? ( // Solo mostrar este mensaje si hay paciente seleccionado y se buscó, pero no hay consultas
                            <tr><td colSpan="5" className="empty-state">No hay consultas para el paciente seleccionado.</td></tr>
                        ) : (!selectedPaciente && !initialSearchPerformed.current) ? ( // Mensaje inicial si no se ha buscado nada
                            <tr><td colSpan="5" className="empty-state">Seleccione un paciente y haga clic en "Buscar Historial".</td></tr>
                        ) : (selectedPaciente && !initialSearchPerformed.current) ? ( // Mensaje si se seleccionó paciente pero no se ha buscado
                            <tr><td colSpan="5" className="empty-state">Seleccione un paciente y haga clic en "Buscar Historial".</td></tr>
                        ) : ( // Mostrar consultas
                            consultas.map(c => (
                                <tr key={c.id_consulta}>
                                    <td>{formatFecha(c.fecha_turno)}</td>
                                    <td>{c.medico.apellido}, {c.medico.nombre}</td>
                                    <td>{c.motivo_consulta || <span className="entity-text-muted">N/A</span>}</td>
                                    <td>{c.observaciones || <span className="entity-text-muted">Sin observaciones</span>}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn-entity-primary btn-entity-sm"
                                            onClick={() => navigate(`/consulta/${c.id_consulta}?idPaciente=${selectedPaciente}`)} // Pasamos idPaciente
                                            title="Ver detalle"
                                        >
                                            👁️ Ver
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

export default HistorialClinicoList;