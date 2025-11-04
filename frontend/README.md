# Medical Clinic CRUD Application

This project is a medical clinic management application built with React and Vite. It provides a basic CRUD interface for managing various entities related to a medical clinic, including specialties, medical histories, appointment schedules, medications, doctors, patients, consultation types, and medication types.

## Project Structure

The project is organized as follows:

```
medical-clinic-crud-vite-react
├── index.html          # Main HTML file
├── package.json        # Project metadata and dependencies
├── vite.config.js      # Vite configuration
├── README.md           # Project documentation
├── .gitignore          # Files to ignore in version control
└── src
    ├── main.jsx        # Entry point for the React application
    ├── App.jsx         # Main application component with routing
    ├── index.css       # Global styles
    ├── routes
    │   └── index.jsx   # Application routes
    ├── components
    │   └── layout
    │       ├── Layout.jsx          # Layout component
    │       ├── Navbar.jsx          # Navigation bar component
    │       └── Sidebar.jsx         # Sidebar component
    ├── pages
    │   ├── Home.jsx                # Home page component
    │   └── NotFound.jsx            # 404 Not Found page component
    ├── services
    │   ├── apiClient.js            # API client for backend interactions
    │   └── storage.js              # Local storage management
    ├── utils
    │   ├── constants.js            # Application constants
    │   └── validators.js           # Form validation functions
    └── features
        ├── especialidad            # Features for managing specialties
        │   ├── pages
        │   │   ├── EspecialidadList.jsx
        │   │   ├── EspecialidadCreate.jsx
        │   │   ├── EspecialidadEdit.jsx
        │   │   └── EspecialidadView.jsx
        │   ├── components
        │   │   ├── EspecialidadForm.jsx
        │   │   └── EspecialidadTable.jsx
        │   └── services
        │       └── especialidadService.js
        ├── historial-clinico        # Features for managing medical histories
        │   ├── pages
        │   │   ├── HistorialClinicoList.jsx
        │   │   ├── HistorialClinicoCreate.jsx
        │   │   ├── HistorialClinicoEdit.jsx
        │   │   └── HistorialClinicoView.jsx
        │   ├── components
        │   │   ├── HistorialClinicoForm.jsx
        │   │   └── HistorialClinicoTable.jsx
        │   └── services
        │       └── historialClinicoService.js
        ├── horario-atencion          # Features for managing appointment schedules
        │   ├── pages
        │   │   ├── HorarioAtencionList.jsx
        │   │   ├── HorarioAtencionCreate.jsx
        │   │   ├── HorarioAtencionEdit.jsx
        │   │   └── HorarioAtencionView.jsx
        │   ├── components
        │   │   ├── HorarioAtencionForm.jsx
        │   │   └── HorarioAtencionTable.jsx
        │   └── services
        │       └── horarioAtencionService.js
        ├── medicamento                # Features for managing medications
        │   ├── pages
        │   │   ├── MedicamentoList.jsx
        │   │   ├── MedicamentoCreate.jsx
        │   │   ├── MedicamentoEdit.jsx
        │   │   └── MedicamentoView.jsx
        │   ├── components
        │   │   ├── MedicamentoForm.jsx
        │   │   └── MedicamentoTable.jsx
        │   └── services
        │       └── medicamentoService.js
        ├── medico                    # Features for managing doctors
        │   ├── pages
        │   │   ├── MedicoList.jsx
        │   │   ├── MedicoCreate.jsx
        │   │   ├── MedicoEdit.jsx
        │   │   └── MedicoView.jsx
        │   ├── components
        │   │   ├── MedicoForm.jsx
        │   │   └── MedicoTable.jsx
        │   └── services
        │       └── medicoService.js
        ├── paciente                   # Features for managing patients
        │   ├── pages
        │   │   ├── PacienteList.jsx
        │   │   ├── PacienteCreate.jsx
        │   │   ├── PacienteEdit.jsx
        │   │   └── PacienteView.jsx
        │   ├── components
        │   │   ├── PacienteForm.jsx
        │   │   └── PacienteTable.jsx
        │   └── services
        │       └── pacienteService.js
        ├── tipo-consulta              # Features for managing consultation types
        │   ├── pages
        │   │   ├── TipoConsultaList.jsx
        │   │   ├── TipoConsultaCreate.jsx
        │   │   ├── TipoConsultaEdit.jsx
        │   │   └── TipoConsultaView.jsx
        │   ├── components
        │   │   ├── TipoConsultaForm.jsx
        │   │   └── TipoConsultaTable.jsx
        │   └── services
        │       └── tipoConsultaService.js
        ├── tipo-medicamento           # Features for managing medication types
        │   ├── pages
        │   │   ├── TipoMedicamentoList.jsx
        │   │   ├── TipoMedicamentoCreate.jsx
        │   │   ├── TipoMedicamentoEdit.jsx
        │   │   └── TipoMedicamentoView.jsx
        │   ├── components
        │   │   ├── TipoMedicamentoForm.jsx
        │   │   └── TipoMedicamentoTable.jsx
        │   └── services
        │       └── tipoMedicamentoService.js
        └── turno                      # Features for managing appointments
            ├── pages
            │   ├── TurnoList.jsx
            │   ├── TurnoCreate.jsx
            │   ├── TurnoEdit.jsx
            │   └── TurnoView.jsx
            ├── components
            │   ├── TurnoForm.jsx
            │   └── TurnoTable.jsx
            └── services
                └── turnoService.js
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd medical-clinic-crud-vite-react
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Features

- Manage specialties, medical histories, appointment schedules, medications, doctors, patients, consultation types, and medication types.
- Create, read, update, and delete records for each entity.
- User-friendly interface with navigation to different sections of the application.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.