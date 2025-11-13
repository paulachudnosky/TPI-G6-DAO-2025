import React, { useState } from 'react';
import TurnosPorEspecialidad from '../components/TurnosPorEspecialidad';
import EstadoTurnos from '../components/EstadoTurnos';
import PacientesAtendidos from '../components/PacientesAtendidos';
import TurnosPorMedicoPeriodo from '../components/TurnosPorMedicoPeriodo';
import '../styles/estadisticas.css';

const EstadisticasPage = () => {
    const [selectedReport, setSelectedReport] = useState(null);

    const reportes = {
        turnosPorMedico: {
            label: 'Listado de turnos por médico en un período',
            component: <TurnosPorMedicoPeriodo />
        },
        turnosPorEspecialidad: {
            label: 'Cantidad de turnos por especialidad',
            component: <TurnosPorEspecialidad />
        },
        pacientesAtendidos: {
            label: 'Pacientes atendidos en un rango de fechas',
            component: <PacientesAtendidos />
        },
        asistencia: {
            label: 'Asistencia vs. Inasistencias de pacientes',
            component: <EstadoTurnos />
        }
    };

    return (
        <div className="entity-container">
            <div className="entity-header">
                <h2>📊 Panel de Estadísticas</h2>
            </div>

            <div className="report-menu">
                <p>Seleccione un informe para visualizar:</p>
                {Object.keys(reportes).map(key => (
                    <button key={key} onClick={() => setSelectedReport(key)} className={`btn-report-menu ${selectedReport === key ? 'active' : ''}`}>
                        {reportes[key].label}
                    </button>
                ))}
            </div>

            <div className="report-view-container">
                {selectedReport ? (
                    reportes[selectedReport].component
                ) : (
                    <div className="report-empty-state">Seleccione un informe para comenzar.</div>
                )}
            </div>
        </div>
    );
};

export default EstadisticasPage;