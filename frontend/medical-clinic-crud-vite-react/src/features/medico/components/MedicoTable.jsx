import React from 'react';

const MedicoTable = ({ medicos, onEdit, onDelete }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {medicos.map(medico => (
                        <tr key={medico.id}>
                            <td>{medico.id}</td>
                            <td>{medico.nombre}</td>
                            <td>{medico.especialidad}</td>
                            <td className="text-end">
                                {onEdit && (
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(medico.id)}>Editar</button>
                                )}
                                {onDelete && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(medico.id)}>Eliminar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MedicoTable;