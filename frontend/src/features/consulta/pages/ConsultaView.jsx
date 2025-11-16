import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'; // Importamos useSearchParams
import { getConsultaById, getRecetaPorConsulta } from '../services/consultaService';
import RecetaMedica from '../components/RecetaMedica'; // 1. Importamos el componente correcto
import '../styles/consulta.css';

const ConsultaView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState(null);
    const [receta, setReceta] = useState(null); // Estado para la receta
    const [loading, setLoading] = useState(true);
    const [loadingReceta, setLoadingReceta] = useState(true); // Estado de carga para la receta
    const [searchParams] = useSearchParams(); // Hook para manejar parámetros de URL
    const idPacienteFromUrl = searchParams.get('idPaciente'); // Obtenemos el idPaciente de la URL

    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar datos de la consulta
                const data = await getConsultaById(id);
                setConsulta(data);

                // Cargar datos de la receta asociada
                const dataReceta = await getRecetaPorConsulta(id);
                setReceta(dataReceta);

            } catch (error) {
                alert('❌ Error al cargar la consulta');
                navigate(`/historial-clinico${idPacienteFromUrl ? `?idPaciente=${idPacienteFromUrl}` : ''}`); // Volver al historial manteniendo el paciente
            } finally {
                setLoading(false);
                setLoadingReceta(false);
            }
        };
        loadData(); // Ejecutamos la carga de datos
    }, [id, navigate, idPacienteFromUrl]); // Agregamos idPacienteFromUrl a las dependencias

    const formatFecha = (fechaISO) => {
        if (!fechaISO) return 'N/A';
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        }) + ' hs';
    };

    if (loading) {
        return <div className="entity-loading">Cargando consulta...</div>;
    }

    if (!consulta) {
        return <div className="entity-alert entity-alert-danger">Consulta no encontrada</div>;
    }

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>👁️ Detalle de la Consulta</h2>
                <button
                    className="btn-entity-secondary"
                    onClick={() => navigate(`/historial-clinico${idPacienteFromUrl ? `?idPaciente=${idPacienteFromUrl}` : ''}`)} // Volver al historial manteniendo el paciente
                >
                    ← Volver al Historial
                </button>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Paciente</h3>
                <p className="consulta-section-content">
                    {consulta.paciente.apellido}, {consulta.paciente.nombre}
                </p>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Médico</h3>
                <p className="consulta-section-content">
                    {consulta.medico.apellido}, {consulta.medico.nombre}
                </p>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Fecha y Hora</h3>
                <p className="consulta-section-content">{formatFecha(consulta.fecha_turno)}</p>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Motivo de la Consulta</h3>
                <p className="consulta-section-content">
                    {consulta.motivo_consulta || <span className="entity-text-muted">N/A</span>}
                </p>
            </div>

            <div className="consulta-section">
                <h3 className="consulta-section-title">Observaciones del Médico</h3>
                <p className="consulta-section-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {consulta.observaciones || <span className="entity-text-muted">Sin observaciones</span>}
                </p>
            </div>

            {/* Sección para mostrar la receta */}
            {loadingReceta ? (
                <div className="entity-loading">Cargando receta...</div>
            ) : (
                receta && receta.medicamentos && receta.medicamentos.length > 0 ? ( // Si existe la receta y tiene medicamentos, la mostramos
                    <div className="consulta-section">
                        <h3 className="consulta-section-title">Receta Adjunta</h3>
                        <RecetaMedica
                            fechaEmision={new Date(receta.fecha_emision).toLocaleDateString('es-AR')}
                            numeroRecetario={receta.id_receta}
                            obraSocial="JERARQUICOS SALUD" // Placeholder
                            numeroAfiliado={`${consulta.paciente.dni}/00`} // Placeholder
                            dniPaciente={consulta.paciente.dni}
                            diagnostico={consulta.motivo_consulta}
                            plan="PLAN 310" // Placeholder
                            medicamentos={receta.medicamentos.map(m => ({ ...m, cantidad: 1 }))}
                            nombreDoctor={`${consulta.medico.apellido}, ${consulta.medico.nombre}`}
                            matriculaDoctor={consulta.medico.matricula}
                            especialidadDoctor={consulta.medico.especialidad}
                            urlQr={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://www.clinicacurae.com/verificar/${receta.id_receta}`}
                            firmaDoctorUrl="/digitalizacion-de-firmas-personales-para-documentos.png"
                        />
                    </div>
                ) : ( // Si no existe o no tiene medicamentos, mostramos un mensaje
                    <div className="consulta-section">
                        <h3 className="consulta-section-title">Receta</h3>
                        <p className="consulta-section-content entity-text-muted">No hay receta adjunta para esta consulta.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default ConsultaView;