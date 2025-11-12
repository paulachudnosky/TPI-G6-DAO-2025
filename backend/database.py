import sqlite3
import os

# --- Configuración Centralizada de la Base de Datos ---

# Obtenemos la ruta absoluta del directorio donde se encuentra este script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Definimos la ruta completa al archivo de la base de datos
DB_PATH = os.path.join(BASE_DIR, 'turnos.db')

def get_db_connection():
    """
    Establece la conexión con la base de datos usando la ruta absoluta.
    """
    conn = sqlite3.connect(DB_PATH)
    # Habilitar claves foráneas
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def crear_base_de_datos_si_no_existe():
    """
    Crea la base de datos y las tablas si el archivo no existe.
    """
    if not os.path.exists(DB_PATH):
        print(f"Creando base de datos en: {DB_PATH}")
        crear_tablas()
    
def crear_tablas():
    """Crea la base de datos y las tablas si no existen."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Paciente
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Paciente (
        id_paciente INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        dni TEXT NOT NULL UNIQUE,
        fecha_nacimiento TEXT,
        email TEXT UNIQUE,
        telefono TEXT
    )''')

    # Especialidad
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Especialidad (
        id_especialidad INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT
    )''')

    # Medico
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Medico (
        id_medico INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        matricula TEXT NOT NULL UNIQUE,
        email TEXT UNIQUE,
        id_especialidad INTEGER,
        FOREIGN KEY (id_especialidad) REFERENCES Especialidad (id_especialidad)
    )''')
    
   
    
    # Horario de atención
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS HorarioAtencion (
        id_horario INTEGER PRIMARY KEY AUTOINCREMENT,
        id_medico INTEGER NOT NULL,
        dia_semana TEXT NOT NULL, -- "Lunes", "Martes", etc.
        hora_inicio TEXT NOT NULL, -- "HH:MM"
        hora_fin TEXT NOT NULL,
        FOREIGN KEY (id_medico) REFERENCES Medico (id_medico) ON DELETE CASCADE,
        CHECK (hora_inicio < hora_fin)
    )''')
    
    # Tipo consulta 
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS TipoConsulta (
        id_tipo INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT,
        duracion_minutos INTEGER
    )''')
    
    # Tipo Medicamento
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS TipoMedicamento (
        id_tipo_medicamento INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
    )''')
    
    # Medicamento
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Medicamento (
        id_medicamento INTEGER PRIMARY KEY AUTOINCREMENT,
        id_tipo_medicamento INTEGER NOT NULL,
        codigo_nacional TEXT UNIQUE,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        forma_farmaceutica TEXT, -- Ej: "Comprimido", "Jarabe", "Inyectable"
        presentacion TEXT, -- Ej: "Caja x 20 comprimidos de 500mg"
        FOREIGN KEY (id_tipo_medicamento) REFERENCES TipoMedicamento (id_tipo_medicamento)
    )''')
    
    # Turno (id_especialidad puede ser nulo)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Turno (
        id_turno INTEGER PRIMARY KEY AUTOINCREMENT,
        id_paciente INTEGER NOT NULL,
        id_medico INTEGER NOT NULL,
        id_especialidad INTEGER, 
        id_tipo_consulta INTEGER NOT NULL, 
        fecha_hora_inicio TEXT NOT NULL,   
        fecha_hora_fin TEXT NOT NULL,      
        estado TEXT NOT NULL,
        FOREIGN KEY (id_paciente) REFERENCES Paciente (id_paciente),
        FOREIGN KEY (id_medico) REFERENCES Medico (id_medico),
        FOREIGN KEY (id_especialidad) REFERENCES Especialidad (id_especialidad),
        FOREIGN KEY (id_tipo_consulta) REFERENCES TipoConsulta (id_tipo) -- CAMPO NUEVO
    )''')
    
    # Consulta
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Consulta (
        id_consulta INTEGER PRIMARY KEY AUTOINCREMENT,
        id_turno INTEGER NOT NULL,
        motivo_consulta TEXT,
        observaciones TEXT,
        FOREIGN KEY (id_turno) REFERENCES Turno (id_turno)
    )''')
    
    # Receta
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Receta (
        id_receta INTEGER PRIMARY KEY AUTOINCREMENT,
        id_consulta INTEGER NOT NULL,
        fecha_emision TEXT NOT NULL,
        vigencia_dias INTEGER,
        FOREIGN KEY (id_consulta) REFERENCES Consulta (id_consulta)
    )''')
    
    # Medicamento Receta
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS MedicamentoReceta (
        id_medicamento INTEGER NOT NULL,
        id_receta INTEGER NOT NULL,
        indicaciones TEXT, -- Instrucciones específicas para este medicamento (posología)
        PRIMARY KEY (id_medicamento, id_receta),
        FOREIGN KEY (id_medicamento) REFERENCES Medicamento (id_medicamento),
        FOREIGN KEY (id_receta) REFERENCES Receta (id_receta)
    )''')
    
    conn.commit()
    conn.close()
    print(f"Base de datos y tablas (actualizadas) creadas exitosamente en {DB_PATH}.")

if __name__ == '__main__':
    crear_tablas()