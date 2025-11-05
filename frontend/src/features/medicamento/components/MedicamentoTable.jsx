import React from 'react';

const MedicamentoTable = ({ medicamentos, onEdit, onDelete }) => {
    const showActions = Boolean(onEdit || onDelete);
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        {showActions && <th className="text-end">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {medicamentos.map((medicamento) => (
                        <tr key={medicamento.id_medicamento}>
                            <td>{medicamento.id_medicamento}</td>
                            <td>{medicamento.nombre}</td>
                            <td>{medicamento.descripcion}</td>
                            {showActions && (
                                <td className="text-end">
                                    {onEdit && (
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(medicamento.id_medicamento)}>Editar</button>
                                    )}
                                    {onDelete && (
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(medicamento.id_medicamento)}>Eliminar</button>
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

export default MedicamentoTable;