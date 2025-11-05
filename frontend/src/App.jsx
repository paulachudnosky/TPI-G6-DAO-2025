import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import HistorialClinicoList from './features/historial-clinico/pages/HistorialClinicoList';

import MedicamentoList from './features/medicamento/pages/MedicamentoList';
// CRUD pacientes
import PacienteList from './features/paciente/pages/PacienteList';
import PacienteCreate from './features/paciente/pages/PacienteCreate';
import PacienteEdit from './features/paciente/pages/PacienteEdit';
import PacienteView from './features/paciente/pages/PacienteView';


import TipoConsultaList from './features/tipo-consulta/pages/TipoConsultaList';
import TipoMedicamentoList from './features/tipo-medicamento/pages/TipoMedicamentoList';
import TurnoList from './features/turno/pages/TurnoList';

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

          <Route path="/historial-clinico" element={<HistorialClinicoList />} />

          {/* Rutas CRUD Horario de Atención */}

          <Route path="/horario-atencion" element={<HorarioAtencionList />} />
          <Route path="/horario-atencion/nuevo" element={<HorarioAtencionCreate />} />
          <Route path="/horario-atencion/:id/editar" element={<HorarioAtencionEdit />} />

          <Route path="/medicamento" element={<MedicamentoList />} />
          
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
          <Route path="/tipo-medicamento" element={<TipoMedicamentoList />} />
          <Route path="/turno" element={<TurnoList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;