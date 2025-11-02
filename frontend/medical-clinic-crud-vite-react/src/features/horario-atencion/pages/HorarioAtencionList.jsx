import React, { useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import horarioAtencionService from '../services/horarioAtencionService';

const HorarioAtencionList = () => {
    const [idMedico, setIdMedico] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHorarios = async () => {
        if (!idMedico) return;
        setLoading(true);
        setError(null);
        try {
            const data = await horarioAtencionService.getByMedico(idMedico);
            setHorarios(data);
        } catch (err) {
            setError(typeof err === 'string' ? err : err?.message || 'Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <PageHeader title="Horarios de Atención" color="success" />

            <div className="mb-3 d-flex align-items-end gap-2">
                <div>
                    <label className="form-label">ID Médico</label>
                    <input
                        type="number"
                        className="form-control"
                        value={idMedico}
                        onChange={(e) => setIdMedico(e.target.value)}
                        placeholder="Ingrese ID de médico"
                        style={{ maxWidth: 240 }}
                    />
                </div>
                <button className="btn btn-success" onClick={fetchHorarios}>Buscar</button>
            </div>

            {loading && <div className="alert alert-info">Cargando...</div>}
            {error && <div className="alert alert-danger">Error: {error}</div>}

            {!loading && horarios?.length === 0 && (
                <div className="alert alert-warning">No hay horarios para mostrar.</div>
            )}

            {horarios?.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Día</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {horarios.map((h) => (
                                <tr key={h.id}>
                                    <td>{h.id}</td>
                                    <td>{h.dia_semana ?? h.diaSemana ?? '-'}</td>
                                    <td>{h.hora_inicio ?? h.horaInicio ?? '-'}</td>
                                    <td>{h.hora_fin ?? h.horaFin ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default HorarioAtencionList;