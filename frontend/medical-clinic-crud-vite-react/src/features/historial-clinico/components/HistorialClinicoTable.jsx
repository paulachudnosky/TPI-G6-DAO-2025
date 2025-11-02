import React from 'react';

const HistorialClinicoTable = ({ historialClinicos, onEdit, onDelete }) => {
    const showActions = Boolean(onEdit || onDelete);
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Fecha</th>
                        {showActions && <th className="text-end">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {historialClinicos.map(historial => (
                        <tr key={historial.id}>
                            <td>{historial.id}</td>
                            <td>{historial.paciente}</td>
                            <td>{historial.medico}</td>
                            <td>{historial.fecha}</td>
                            {showActions && (
                                <td className="text-end">
                                    {onEdit && (
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(historial.id)}>Editar</button>
                                    )}
                                    {onDelete && (
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(historial.id)}>Eliminar</button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialClinicoTable;