import React from 'react';

const HorarioAtencionTable = ({ horarios, onEdit, onDelete }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Hora Inicio</th>
                    <th>Hora Fin</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {horarios.map((horario) => (
                    <tr key={horario.id}>
                        <td>{horario.id}</td>
                        <td>{horario.fecha}</td>
                        <td>{horario.horaInicio}</td>
                        <td>{horario.horaFin}</td>
                        <td>
                            <button onClick={() => onEdit(horario.id)}>Editar</button>
                            <button onClick={() => onDelete(horario.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default HorarioAtencionTable;