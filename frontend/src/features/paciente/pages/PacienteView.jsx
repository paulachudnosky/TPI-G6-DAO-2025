import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPacienteById } from '../services/pacienteService';
import '../styles/paciente.css'; // Importamos los estilos

const PacienteView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const data = await getPacienteById(id);
                setPaciente(data);
            } catch (err) {
                alert('❌ Error al cargar los datos del paciente.');
                navigate('/pacientes');
            } finally {
                setLoading(false);
            }
        };
        fetchPaciente();
    }, [id, navigate]);

    if (loading) return <div className="entity-loading">Cargando...</div>;
    if (!paciente) return <div className="entity-alert entity-alert-danger">Paciente no encontrado</div>;

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>👁️ Detalle del Paciente</h2>
                <div>
                    <button className="btn-entity-primary" onClick={() => navigate(`/pacientes/${id}/editar`)}>
                        ✏️ Editar
                    </button>
                    <button className="btn-entity-secondary" onClick={() => navigate('/pacientes')}>
                        ← Volver a la lista
                    </button>
                </div>
            </div>
            <div className="entity-detail">
                <div className="entity-detail-group">
                    <label className="entity-detail-label">Nombre Completo:</label>
                    <p className="entity-detail-value">{`${paciente.nombre} ${paciente.apellido}`}</p>
                </div>
                <div className="entity-detail-group">
                    <label className="entity-detail-label">DNI:</label>
                    <p className="entity-detail-value">{paciente.dni}</p>
                </div>
                <div className="entity-detail-group">
                    <label className="entity-detail-label">Fecha de Nacimiento:</label>
                    <p className="entity-detail-value">{paciente.fecha_nacimiento || <span className="entity-text-muted">Sin dato</span>}</p>
                </div>
                <div className="entity-detail-group">
                    <label className="entity-detail-label">Email:</label>
                    <p className="entity-detail-value">{paciente.email || <span className="entity-text-muted">Sin dato</span>}</p>
                </div>
                <div className="entity-detail-group">
                    <label className="entity-detail-label">Teléfono:</label>
                    <p className="entity-detail-value">{paciente.telefono || <span className="entity-text-muted">Sin dato</span>}</p>
                </div>
            </div>
        </div>
    );
};

export default PacienteView;