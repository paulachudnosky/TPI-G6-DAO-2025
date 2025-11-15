// src/components/layout/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
// Importamos todos los íconos que vas a necesitar
import { 
    FaHome, FaCalendarAlt, FaUserMd, FaUserInjured, FaStethoscope, 
    FaCapsules, FaNotesMedical, FaClock, FaSignOutAlt, FaPills,
    FaChartBar 
} from 'react-icons/fa';

const Sidebar = () => {

    // Tu lista de enlaces COMPLETA, con íconos
    const adminLinks = [
        { to: "/turno", icon: <FaCalendarAlt />, text: "Turnos" },
        { to: "/especialidad", icon: <FaStethoscope />, text: "Especialidades" },
        { to: "/medico", icon: <FaUserMd />, text: "Médicos" },
        { to: "/pacientes", icon: <FaUserInjured />, text: "Pacientes" },
        { to: "/medicamento", icon: <FaCapsules />, text: "Medicamentos" },
        { to: "/tipo-consulta", icon: <FaNotesMedical />, text: "Tipos de Consulta" },
        { to: "/consulta", icon: <FaNotesMedical />, text: "Consultas" },
        { to: "/tipo-medicamento", icon: <FaPills />, text: "Tipos de Medicamento" },
        { to: "/historial-clinico", icon: <FaNotesMedical />, text: "Historial Clínico" },
        { to: "/horario-atencion", icon: <FaClock />, text: "Horarios de Atención" },
        { to: "/estadisticas", icon: <FaChartBar />, text: "Estadísticas" }
    ];

    return (
        <Nav className="flex-column" variant="pills" defaultActiveKey="/">
            {/* Enlace al Home */}
            <LinkContainer to="/">
                <Nav.Link className="text-white mb-2"> {/* <-- Links Blancos */}
                    <FaHome className="me-2" /> Home
                </Nav.Link>
            </LinkContainer>

            {/* Mapea todos tus enlaces */}
            {adminLinks.map((link) => (
                <LinkContainer to={link.to} key={link.to}>
                    <Nav.Link className="text-white-50"> {/* <-- Links Blancos */}
                        {link.icon && React.cloneElement(link.icon, { className: 'me-2' })}
                        {link.text}
                    </Nav.Link>
                </LinkContainer>
            ))}

            {/* Enlace de Cerrar Sesión al final */}
            <hr className="text-white-50"/>
            <LinkContainer to="/logout">
                <Nav.Link className="text-white-50">
                    <FaSignOutAlt className="me-2" /> Cerrar Sesión
                </Nav.Link>
            </LinkContainer>
        </Nav>
    );
};

export default Sidebar;