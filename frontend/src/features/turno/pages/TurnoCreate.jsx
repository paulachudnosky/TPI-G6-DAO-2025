import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createTurno } from '../services/turnoService';
import { getPacientes } from '../../paciente/services/pacienteService';
import { getEspecialidades } from '../../especialidad/services/especialidadService';
import { getMedicos } from '../../medico/services/medicoService';
import { getHorariosByMedico } from '../../horario-atencion/services/horarioAtencionService';
import tipoConsultaService from '../../tipo-consulta/services/tipoConsultaService';
import { obtenerTurnosPorMedicoYDia } from '../services/turnoService';
import '../styles/turno.css';

const TurnoCreate = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fechaParam = searchParams.get('fecha');

    // Estados del formulario
    const [pacientes, setPacientes] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [medicosOriginal, setMedicosOriginal] = useState([]);
    const [tiposConsulta, setTiposConsulta] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [slotsDisponibles, setSlotsDisponibles] = useState([]);

    // Valores del formulario
    const [idPaciente, setIdPaciente] = useState('');
    const [searchPaciente, setSearchPaciente] = useState('');
    const [modoSeleccion, setModoSeleccion] = useState('medico'); // 'medico' o 'especialidad'
    const [idEspecialidad, setIdEspecialidad] = useState('');
    const [idMedico, setIdMedico] = useState('');
    const [fecha, setFecha] = useState(fechaParam || '');
    const [idTipoConsulta, setIdTipoConsulta] = useState('');
    const [horaSeleccionada, setHoraSeleccionada] = useState('');

    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    // Filtrar médicos por especialidad
    useEffect(() => {
        if (modoSeleccion === 'especialidad' && idEspecialidad) {
            const medicosFiltrados = medicosOriginal.filter(
                m => m.id_especialidad === parseInt(idEspecialidad)
            );
            setMedicos(medicosFiltrados);
            setIdMedico(''); // Reset médico seleccionado
        } else if (modoSeleccion === 'medico') {
            setMedicos(medicosOriginal);
        }
    }, [modoSeleccion, idEspecialidad, medicosOriginal]);

    // Cargar horarios cuando se selecciona médico
    useEffect(() => {
        if (idMedico) {
            cargarHorariosMedico(idMedico);
            // Actualizar especialidad si estamos en modo médico
            if (modoSeleccion === 'medico') {
                const medicoSeleccionado = medicosOriginal.find(m => m.id_medico === parseInt(idMedico));
                if (medicoSeleccionado) {
                    setIdEspecialidad(medicoSeleccionado.id_especialidad.toString());
                }
            }
        } else {
            setHorarios([]);
            setSlotsDisponibles([]);
            setFecha(''); // Resetear fecha cuando no hay médico
            setHoraSeleccionada('');
        }
    }, [idMedico]);

    // Validar fecha cuando cambian los horarios del médico
    useEffect(() => {
        if (fecha && idMedico && horarios.length > 0) {
            // Verificar si la fecha actual es válida para los nuevos horarios
            const diasMap = {
                'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miércoles': 3,
                'Jueves': 4, 'Viernes': 5, 'Sábado': 6
            };
            const diasAtencion = horarios.map(h => diasMap[h.dia_semana]).filter(d => d !== undefined);
            const fechaObj = new Date(fecha + 'T12:00:00');
            const diaSemana = fechaObj.getDay();

            if (!diasAtencion.includes(diaSemana)) {
                setFecha(''); // Resetear si la fecha ya no es válida
                setHoraSeleccionada('');
            }
        }
    }, [horarios]);

    // Cargar slots cuando cambia fecha o médico
    useEffect(() => {
        if (idMedico && fecha) {
            generarSlotsDisponibles();
        } else {
            setSlotsDisponibles([]);
        }
    }, [idMedico, fecha, horarios]);

    const cargarDatosIniciales = async () => {
        try {
            const [pacientesData, especialidadesData, medicosData, tiposConsultaData] = await Promise.all([
                getPacientes(),
                getEspecialidades(),
                getMedicos(),
                tipoConsultaService.getAll()
            ]);

            // Filtrar para mostrar solo pacientes y médicos activos
            const pacientesActivos = pacientesData.filter(p => p.activo);
            const especialidadesActivas = especialidadesData.filter(e => e.activo);
            const medicosActivos = medicosData.filter(m => m.activo);

            setPacientes(pacientesActivos);
            setEspecialidades(especialidadesActivas);
            setMedicos(medicosActivos);
            setMedicosOriginal(medicosActivos);
            setTiposConsulta(tiposConsultaData);
        } catch (err) {
            setError('Error al cargar los datos necesarios.');
            console.error(err);
        }
    };

    const cargarHorariosMedico = async (medicoId) => {
        try {
            const horariosData = await getHorariosByMedico(medicoId);
            setHorarios(horariosData);
        } catch (err) {
            console.error('Error al cargar horarios del médico:', err);
            setHorarios([]);
        }
    };

    const generarSlotsDisponibles = async () => {
        setLoadingSlots(true);
        try {
            // Obtener día de la semana
            const fechaObj = new Date(fecha + 'T12:00:00');
            const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const diaSemana = diasSemana[fechaObj.getDay()];

            // Buscar horario del médico para ese día
            const horarioDelDia = horarios.find(h => h.dia_semana === diaSemana);

            if (!horarioDelDia) {
                setSlotsDisponibles([]);
                setLoadingSlots(false);
                return;
            }

            // Obtener turnos existentes del médico para ese día
            const turnosExistentes = await obtenerTurnosPorMedicoYDia(idMedico, fecha);

            // Generar slots de 30 minutos
            const slots = [];
            const [horaInicio, minInicio] = horarioDelDia.hora_inicio.split(':').map(Number);
            const [horaFin, minFin] = horarioDelDia.hora_fin.split(':').map(Number);

            let hora = horaInicio;
            let minuto = minInicio;

            while (hora < horaFin || (hora === horaFin && minuto < minFin)) {
                const horaStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
                const fechaHoraInicio = `${fecha}T${horaStr}:00`;

                // Calcular hora fin del slot (30 minutos después)
                let horaFinSlot = hora;
                let minFinSlot = minuto + 30;
                if (minFinSlot >= 60) {
                    horaFinSlot++;
                    minFinSlot -= 60;
                }

                // Verificar si el slot está ocupado
                const ocupado = turnosExistentes.some(turno => {
                    const inicioTurno = new Date(turno.fecha_hora_inicio);
                    const finTurno = new Date(turno.fecha_hora_fin);
                    const inicioSlot = new Date(fechaHoraInicio);

                    return inicioSlot >= inicioTurno && inicioSlot < finTurno;
                });

                // Verificar si es en el pasado
                const ahora = new Date();
                const fechaHoraSlot = new Date(fechaHoraInicio);
                const enPasado = fechaHoraSlot < ahora;

                slots.push({
                    hora: horaStr,
                    disponible: !ocupado && !enPasado,
                    ocupado,
                    enPasado
                });

                // Avanzar 30 minutos
                minuto += 30;
                if (minuto >= 60) {
                    hora++;
                    minuto = 0;
                }
            }

            setSlotsDisponibles(slots);
        } catch (err) {
            console.error('Error al generar slots:', err);
            setSlotsDisponibles([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validaciones
        if (!idPaciente) {
            setError('Debe seleccionar un paciente.');
            return;
        }
        if (!idMedico) {
            setError('Debe seleccionar un médico.');
            return;
        }
        if (!fecha) {
            setError('Debe seleccionar una fecha.');
            return;
        }
        if (!horaSeleccionada) {
            setError('Debe seleccionar un horario.');
            return;
        }
        if (!idTipoConsulta) {
            setError('Debe seleccionar un tipo de consulta.');
            return;
        }

        setLoading(true);

        try {
            const fechaHoraInicio = `${fecha}T${horaSeleccionada}:00`;

            // Validar que los IDs sean números válidos antes de enviar
            const pacienteId = parseInt(idPaciente);
            const medicoId = parseInt(idMedico);
            const especialidadId = parseInt(idEspecialidad);
            const tipoConsultaId = parseInt(idTipoConsulta);

            if (isNaN(pacienteId) || isNaN(medicoId) || isNaN(especialidadId) || isNaN(tipoConsultaId)) {
                setError('Error: Uno o más campos tienen valores inválidos. Por favor, verifique los datos.');
                setLoading(false);
                return;
            }

            const turnoData = {
                id_paciente: pacienteId,
                id_medico: medicoId,
                id_especialidad: especialidadId,
                id_tipo_consulta: tipoConsultaId,
                fecha_hora_inicio: fechaHoraInicio
            };

            await createTurno(turnoData);
            setSuccess('✅ Turno creado exitosamente');

            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                navigate(`/turnos/dia/${fecha}`);
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error al crear el turno. Verifique los datos e intente nuevamente.';
            setError(errorMessage);
            console.error('Error al crear turno:', err);
        } finally {
            setLoading(false);
        }
    };

    const pacientesFiltrados = pacientes.filter(p =>
        `${p.nombre} ${p.apellido} ${p.dni}`.toLowerCase().includes(searchPaciente.toLowerCase())
    );

    const getFechaMinima = () => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    };

    // Obtener los días de la semana en los que el médico atiende
    const getDiasAtencion = () => {
        if (!horarios || horarios.length === 0) return [];

        const diasMap = {
            'Domingo': 0,
            'Lunes': 1,
            'Martes': 2,
            'Miércoles': 3,
            'Jueves': 4,
            'Viernes': 5,
            'Sábado': 6
        };

        return horarios.map(h => diasMap[h.dia_semana]).filter(d => d !== undefined);
    };

    // Validar si una fecha está en un día de atención del médico
    const esFechaValida = (fechaStr) => {
        if (!idMedico || !fechaStr) return true;

        const diasAtencion = getDiasAtencion();
        if (diasAtencion.length === 0) return false;

        const fecha = new Date(fechaStr + 'T12:00:00');
        const diaSemana = fecha.getDay();

        return diasAtencion.includes(diaSemana);
    };

    // Manejar cambio de fecha con validación
    const handleFechaChange = (e) => {
        const nuevaFecha = e.target.value;

        if (!idMedico) {
            setFecha(nuevaFecha);
            setHoraSeleccionada('');
            return;
        }

        if (esFechaValida(nuevaFecha)) {
            setFecha(nuevaFecha);
            setHoraSeleccionada('');
        } else {
            const diasAtencion = getDiasAtencion();
            const diasNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const diasTexto = diasAtencion.map(d => diasNombres[d]).join(', ');

            alert(`⚠️ El médico seleccionado solo atiende los días: ${diasTexto}`);
        }
    };

    return (
        <div className="entity-container turno-create-container">
            <div className="entity-header">
                <h2>📅 Crear Nuevo Turno</h2>
                <button
                    className="btn-entity-secondary"
                    onClick={() => navigate(fechaParam ? `/turnos/dia/${fechaParam}` : '/turnos')}
                >
                    ← Volver
                </button>
            </div>

            {error && <div className="entity-alert entity-alert-danger">{error}</div>}
            {success && <div className="entity-alert entity-alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="entity-form">
                {/* PASO 1: Seleccionar Paciente */}
                <div className="form-section">
                    <h3 className="form-section-title">1️⃣ Seleccionar Paciente</h3>

                    <div className="form-group">
                        <label className="form-label">Buscar Paciente</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Buscar por nombre, apellido o DNI..."
                            value={searchPaciente}
                            onChange={(e) => setSearchPaciente(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Paciente *</label>
                        <select
                            className="form-input"
                            value={idPaciente}
                            onChange={(e) => setIdPaciente(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un paciente</option>
                            {pacientesFiltrados.map(paciente => (
                                <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                    {paciente.nombre} {paciente.apellido} - DNI: {paciente.dni}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => navigate('/pacientes/nuevo')}
                        >
                            ➕ ¿Paciente nuevo? Crear paciente
                        </button>
                    </div>
                </div>

                {/* PASO 2: Modo de Selección */}
                <div className="form-section">
                    <h3 className="form-section-title">2️⃣ Seleccionar Médico</h3>

                    <div className="form-group">
                        <label className="form-label">¿Cómo desea buscar?</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="modoSeleccion"
                                    value="medico"
                                    checked={modoSeleccion === 'medico'}
                                    onChange={(e) => {
                                        setModoSeleccion(e.target.value);
                                        setIdEspecialidad('');
                                        setIdMedico('');
                                    }}
                                />
                                <span>Por Médico específico</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="modoSeleccion"
                                    value="especialidad"
                                    checked={modoSeleccion === 'especialidad'}
                                    onChange={(e) => {
                                        setModoSeleccion(e.target.value);
                                        setIdMedico('');
                                    }}
                                />
                                <span>Por Especialidad</span>
                            </label>
                        </div>
                    </div>

                    {modoSeleccion === 'especialidad' && (
                        <div className="form-group">
                            <label className="form-label">Especialidad *</label>
                            <select
                                className="form-input"
                                value={idEspecialidad}
                                onChange={(e) => setIdEspecialidad(e.target.value)}
                                required
                            >
                                <option value="">Seleccione una especialidad</option>
                                {especialidades.map(esp => (
                                    <option key={esp.id_especialidad} value={esp.id_especialidad}>
                                        {esp.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Médico *</label>
                        <select
                            className="form-input"
                            value={idMedico}
                            onChange={(e) => setIdMedico(e.target.value)}
                            required
                            disabled={modoSeleccion === 'especialidad' && !idEspecialidad}
                        >
                            <option value="">Seleccione un médico</option>
                            {medicos.map(medico => (
                                <option key={medico.id_medico} value={medico.id_medico}>
                                    Dr/a. {medico.nombre} {medico.apellido} - {medico.especialidad_nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* PASO 3: Fecha y Tipo de Consulta */}
                <div className="form-section">
                    <h3 className="form-section-title">3️⃣ Fecha y Tipo de Consulta</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Fecha *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={fecha}
                                onChange={handleFechaChange}
                                min={getFechaMinima()}
                                required
                                disabled={!idMedico}
                            />
                            {idMedico && horarios.length > 0 && (
                                <small className="form-hint">
                                    📅 Días de atención: {horarios.map(h => h.dia_semana).join(', ')}
                                </small>
                            )}
                            {idMedico && horarios.length === 0 && (
                                <small className="form-hint text-warning">
                                    ⚠️ Este médico no tiene horarios configurados
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tipo de Consulta *</label>
                            <select
                                className="form-input"
                                value={idTipoConsulta}
                                onChange={(e) => setIdTipoConsulta(e.target.value)}
                                required
                            >
                                <option value="">Seleccione el tipo</option>
                                {tiposConsulta.map(tipo => (
                                    <option key={tipo.id_tipo_consulta} value={tipo.id_tipo_consulta}>
                                        {tipo.nombre} ({tipo.duracion_minutos} min)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* PASO 4: Horarios Disponibles */}
                {idMedico && fecha && (
                    <div className="form-section">
                        <h3 className="form-section-title">4️⃣ Seleccionar Horario</h3>

                        {loadingSlots ? (
                            <div className="loading-slots">Cargando horarios disponibles...</div>
                        ) : slotsDisponibles.length === 0 ? (
                            <div className="entity-alert entity-alert-warning">
                                ⚠️ El médico no tiene horarios de atención para este día.
                            </div>
                        ) : (
                            <>
                                <p className="slots-info">
                                    Horarios disponibles (turnos de 30 minutos):
                                </p>
                                <div className="slots-grid">
                                    {slotsDisponibles.map(slot => (
                                        <button
                                            key={slot.hora}
                                            type="button"
                                            className={`slot-button ${horaSeleccionada === slot.hora ? 'selected' : ''
                                                } ${!slot.disponible ? 'disabled' : ''}`}
                                            onClick={() => slot.disponible && setHoraSeleccionada(slot.hora)}
                                            disabled={!slot.disponible}
                                            title={
                                                slot.enPasado ? 'Horario pasado' :
                                                    slot.ocupado ? 'Horario ocupado' :
                                                        'Disponible'
                                            }
                                        >
                                            {slot.hora}
                                            {slot.enPasado && <span className="slot-badge">Pasado</span>}
                                            {slot.ocupado && <span className="slot-badge">Ocupado</span>}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Botones de acción */}
                <div className="entity-actions">
                    <button
                        type="button"
                        className="btn-entity-secondary"
                        onClick={() => navigate(fechaParam ? `/turnos/dia/${fechaParam}` : '/turnos')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-entity-primary"
                        disabled={loading || !horaSeleccionada}
                    >
                        {loading ? 'Creando...' : '✅ Crear Turno'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TurnoCreate;