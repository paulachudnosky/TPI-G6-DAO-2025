import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ to, title, text, color = 'primary' }) => (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
        <Link to={to} className="text-decoration-none">
            <div className={`card border-${color} h-100`}>
                <div className={`card-header bg-${color} text-white`}>{title}</div>
                <div className="card-body">
                    <p className="card-text text-muted m-0">{text}</p>
                </div>
            </div>
        </Link>
    </div>
);

const Home = () => {
    return (
        <div className="container-fluid">
            <div className="py-3">
                <h1 className="h3">Gestión de Clínica</h1>
                <p className="text-muted">Elegí un módulo para continuar</p>
            </div>
            <div className="row">
                <Card to="/turno" title="Turnos" text="Alta, baja, edición y estados" color="primary" />
                <Card to="/especialidad" title="Especialidades" text="ABM de especialidades" color="success" />
                <Card to="/medico" title="Médicos" text="ABM de médicos" color="info" />
                <Card to="/paciente" title="Pacientes" text="ABM de pacientes" color="warning" />
                <Card to="/medicamento" title="Medicamentos" text="Listado de medicamentos" color="secondary" />
                <Card to="/tipo-consulta" title="Tipos de Consulta" text="Duración y tipo" color="dark" />
                <Card to="/tipo-medicamento" title="Tipos de Medicamento" text="Listado" color="danger" />
                <Card to="/historial-clinico" title="Historial Clínico" text="Consulta y edición" color="primary" />
                <Card to="/horario-atencion" title="Horarios de Atención" text="Consultar por médico" color="success" />
            </div>
        </div>
    );
};

export default Home;