import React from 'react';

const PacienteTable = ({ pacientes, onEdit, onDelete }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Edad</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.map((paciente) => (
                        <tr key={paciente.id}>
                            <td>{paciente.id}</td>
                            <td>{paciente.nombre}</td>
                            <td>{paciente.apellido}</td>
                            <td>{paciente.edad}</td>
                            <td className="text-end">
                                {onEdit && (
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(paciente.id)}>Editar</button>
                                )}
                                {onDelete && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(paciente.id)}>Eliminar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PacienteTable;