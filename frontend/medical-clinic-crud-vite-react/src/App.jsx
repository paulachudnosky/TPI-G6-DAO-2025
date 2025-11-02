import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import EspecialidadList from './features/especialidad/pages/EspecialidadList';
import HistorialClinicoList from './features/historial-clinico/pages/HistorialClinicoList';
import HorarioAtencionList from './features/horario-atencion/pages/HorarioAtencionList';
import MedicamentoList from './features/medicamento/pages/MedicamentoList';
import PacienteList from './features/paciente/pages/PacienteList';
import TipoConsultaList from './features/tipo-consulta/pages/TipoConsultaList';
import TipoMedicamentoList from './features/tipo-medicamento/pages/TipoMedicamentoList';
import TurnoList from './features/turno/pages/TurnoList';

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
          <Route path="/especialidad" element={<EspecialidadList />} />
          <Route path="/historial-clinico" element={<HistorialClinicoList />} />
          <Route path="/horario-atencion" element={<HorarioAtencionList />} />
          <Route path="/medicamento" element={<MedicamentoList />} />
          {/* Rutas CRUD Médico */}
          <Route path="/medico" element={<MedicoList />} />
          <Route path="/medico/nuevo" element={<MedicoCreate />} />
          <Route path="/medico/:id/editar" element={<MedicoEdit />} />
          <Route path="/medico/:id" element={<MedicoView />} />

          <Route path="/paciente" element={<PacienteList />} />
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