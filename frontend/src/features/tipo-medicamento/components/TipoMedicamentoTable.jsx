import React from 'react';

const TipoMedicamentoTable = ({ tipoMedicamentos, onEdit, onDelete }) => {
    const showActions = Boolean(onEdit || onDelete);
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        {showActions && <th className="text-end">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {tipoMedicamentos.map((tipoMedicamento) => (
                        <tr key={tipoMedicamento.id}>
                            <td>{tipoMedicamento.id}</td>
                            <td>{tipoMedicamento.nombre ?? tipoMedicamento.name}</td>
                            {showActions && (
                                <td className="text-end">
                                    {onEdit && (
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(tipoMedicamento.id)}>Editar</button>
                                    )}
                                    {onDelete && (
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(tipoMedicamento.id)}>Eliminar</button>
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

export default TipoMedicamentoTable;