import React from 'react';

const EspecialidadTable = ({ especialidades, onEdit, onDelete }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {especialidades.map((especialidad) => (
                        <tr key={especialidad.id}>
                            <td>{especialidad.id}</td>
                            <td>{especialidad.nombre}</td>
                            <td className="text-end">
                                {onEdit && (
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(especialidad.id)}>
                                        Editar
                                    </button>
                                )}
                                {onDelete && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(especialidad.id)}>
                                        Eliminar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EspecialidadTable;