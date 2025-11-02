import React from 'react';

const TipoConsultaTable = ({ tipoConsultas, onEdit, onDelete }) => {
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
                    {tipoConsultas.map((tipoConsulta) => (
                        <tr key={tipoConsulta.id}>
                            <td>{tipoConsulta.id}</td>
                            <td>{tipoConsulta.nombre}</td>
                            {showActions && (
                                <td className="text-end">
                                    {onEdit && (
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(tipoConsulta.id)}>Editar</button>
                                    )}
                                    {onDelete && (
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(tipoConsulta.id)}>Eliminar</button>
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

export default TipoConsultaTable;