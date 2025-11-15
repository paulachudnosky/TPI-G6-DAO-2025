import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// CRUD Medicamentos
import MedicamentoList from './features/medicamento/pages/MedicamentoList';
import MedicamentoCreate from './features/medicamento/pages/MedicamentoCreate';
import MedicamentoEdit from './features/medicamento/pages/MedicamentoEdit';
import MedicamentoView from './features/medicamento/pages/MedicamentoView';

// CRUD pacientes
import PacienteList from './features/paciente/pages/PacienteList';
import PacienteCreate from './features/paciente/pages/PacienteCreate';
import PacienteEdit from './features/paciente/pages/PacienteEdit';
import PacienteView from './features/paciente/pages/PacienteView';

import HistorialClinicoList from './features/historial-clinico/pages/HistorialClinicoList';


// Crud Consultas
import ConsultaAtencion from './features/consulta/pages/ConsultaAtencion';
import ConsultaList from './features/consulta/pages/ConsultaList';
import ConsultaRegistro from './features/consulta/pages/ConsultaRegistro';
import ConsultaView from './features/consulta/pages/ConsultaView';


import TipoConsultaList from './features/tipo-consulta/pages/TipoConsultaList';
import TurnoList from './features/turno/pages/TurnoList';
import TipoMedicamentoList from './features/tipo-medicamento/pages/TipoMedicamentoList';
import CalendarioTurnos from './features/turno/pages/CalendarioTurnos';
import TurnosDiaView from './features/turno/pages/TurnosDiaView';
import TurnoCreate from './features/turno/pages/TurnoCreate';
import TurnoDetalleView from './features/turno/pages/TurnoDetalleView';

// CRUD horarios de atención
import HorarioAtencionList from './features/horario-atencion/pages/HorarioAtencionList';
import HorarioAtencionCreate from './features/horario-atencion/pages/HorarioAtencionCreate';
import HorarioAtencionEdit from './features/horario-atencion/pages/HorarioAtencionEdit';


// CRUD especialidades
import EspecialidadList from './features/especialidad/pages/EspecialidadList';
import EspecialidadCreate from './features/especialidad/pages/EspecialidadCreate';
import EspecialidadEdit from './features/especialidad/pages/EspecialidadEdit';
import EspecialidadView from './features/especialidad/pages/EspecialidadView';

// CRUD medicos
import MedicoList from './features/medico/pages/MedicoList';
import MedicoCreate from './features/medico/pages/MedicoCreate';
import MedicoEdit from './features/medico/pages/MedicoEdit';
import MedicoView from './features/medico/pages/MedicoView';

// Estadísticas
import EstadisticasPage from './features/estadisticas/pages/EstadisticasPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Rutas CRUD Especialidad */}
          <Route path="/especialidad" element={<EspecialidadList />} />
          <Route path="/especialidad/nuevo" element={<EspecialidadCreate />} />
          <Route path="/especialidad/:id/editar" element={<EspecialidadEdit />} />
          <Route path="/especialidad/:id" element={<EspecialidadView />} />


          {/* Rutas Historial Clinico */}
          <Route path="/historial-clinico" element={<HistorialClinicoList />} />

          <Route path="/consulta" element={<ConsultaAtencion />} />
          <Route path="/consulta/registrar" element={<ConsultaRegistro />} />
          <Route path="/consultas/historial" element={<ConsultaList />} />
          <Route path="/consulta/:id" element={<ConsultaView />} />

          {/* Rutas CRUD Horario de Atención */}

          <Route path="/horario-atencion" element={<HorarioAtencionList />} />
          <Route path="/horario-atencion/nuevo" element={<HorarioAtencionCreate />} />
          <Route path="/horario-atencion/:id/editar" element={<HorarioAtencionEdit />} />

          {/* Rutas CRUD Medicamento */}
          <Route path="/medicamento" element={<MedicamentoList />} />
          <Route path="/medicamento/nuevo" element={<MedicamentoCreate />} />
          <Route path="/medicamento/:id/editar" element={<MedicamentoEdit />} />
          <Route path="/medicamento/:id" element={<MedicamentoView />} />

          {/* Rutas CRUD Médico */}
          <Route path="/medico" element={<MedicoList />} />
          <Route path="/medico/nuevo" element={<MedicoCreate />} />
          <Route path="/medico/:id/editar" element={<MedicoEdit />} />
          <Route path="/medico/:id" element={<MedicoView />} />

          {/* Rutas CRUD Paciente */}
          <Route path="/pacientes" element={<PacienteList />} />
          <Route path="/pacientes/nuevo" element={<PacienteCreate />} />
          <Route path="/pacientes/:id/editar" element={<PacienteEdit />} />
          <Route path="/pacientes/:id" element={<PacienteView />} />

          <Route path="/tipo-consulta" element={<TipoConsultaList />} />

          {/* Rutas de Turnos */}
          <Route path="/turno" element={<CalendarioTurnos />} />
          <Route path="/turnos" element={<CalendarioTurnos />} />
          <Route path="/turnos/calendario" element={<CalendarioTurnos />} />
          <Route path="/turnos/nuevo" element={<TurnoCreate />} />
          <Route path="/turnos/dia/:fecha" element={<TurnosDiaView />} />
          <Route path="/turnos/:id" element={<TurnoDetalleView />} />

          {/* Ruta de Estadísticas */}
          <Route path="/estadisticas" element={<EstadisticasPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;