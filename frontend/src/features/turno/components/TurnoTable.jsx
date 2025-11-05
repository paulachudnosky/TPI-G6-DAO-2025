import React from 'react';

const TurnoTable = ({ turnos, onEdit, onDelete }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {turnos.map(turno => (
                        <tr key={turno.id_turno}>
                            <td>{turno.id_turno}</td>
                            <td>{turno.paciente}</td>
                            <td>{turno.medico}</td>
                            <td>{turno.fecha}</td>
                            <td>{turno.hora}</td>
                            <td className="text-end">
                                {onEdit && (
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(turno.id_turno)}>Editar</button>
                                )}
                                {onDelete && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(turno.id_turno)}>Eliminar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TurnoTable;