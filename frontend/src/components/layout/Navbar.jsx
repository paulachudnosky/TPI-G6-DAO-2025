import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Clínica</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mainNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/turno">Turnos</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/especialidad">Especialidades</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/medico">Médicos</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/pacientes">Pacientes</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/medicamento">Medicamentos</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/tipo-consulta">Tipos de Consulta</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/tipo-medicamento">Tipos de Medicamento</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/historial-clinico">Historial Clínico</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/horario-atencion">Horarios de Atención</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/estadisticas">Estadísticas</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;