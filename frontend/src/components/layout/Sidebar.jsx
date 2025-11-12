import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Item = ({ to, children }) => {
    const { pathname } = useLocation();
    const active = pathname === to || pathname.startsWith(to + '/') ? 'active' : '';
    return (
        <Link to={to} className={`list-group-item list-group-item-action ${active}`}>{children}</Link>
    );
};

const Sidebar = () => {
    return (
        <aside>
            <div className="p-3 border-bottom">
                <h5 className="m-0">Menu</h5>
            </div>
            <div className="list-group list-group-flush">
                <Item to="/">Home</Item>
                <Item to="/turnos">Turnos</Item>
                <Item to="/turnos/calendario">📅 Calendario de Turnos</Item>
                <Item to="/especialidad">Especialidades</Item>
                <Item to="/medico">Médicos</Item>
                <Item to="/pacientes">Pacientes</Item>
                <Item to="/medicamento">Medicamentos</Item>
                <Item to="/tipo-consulta">Tipos de Consulta</Item>
                <Item to="/consulta">Consultas</Item>
                <Item to="/tipo-medicamento">Tipos de Medicamento</Item>
                <Item to="/historial-clinico">Historial Clínico</Item>
                <Item to="/horario-atencion">Horarios de Atención</Item>
                <Item to="/estadisticas">Estadísticas</Item>
            </div>
        </aside>
    );
};

export default Sidebar;