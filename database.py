# database.py
import sqlite3

def crear_base_de_datos():
    """Crea la base de datos y las tablas si no existen."""
    conn = sqlite3.connect('turnos.db')
    cursor = conn.cursor()

    # Usamos TEXT para las fechas para simplificar, SQLite es flexible con los tipos.
    # NOT NULL asegura que el campo siempre tenga un valor.
    # AUTOINCREMENT se encarga de generar los IDs automáticamente.
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Paciente (
        id_paciente INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        dni TEXT NOT NULL UNIQUE,
        fecha_nacimiento TEXT,
        email TEXT,
        telefono TEXT
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Especialidad (
        id_especialidad INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Medico (
        id_medico INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        matricula TEXT NOT NULL UNIQUE,
        email TEXT
    )''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS MedicoEspecialidad (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_medico INTEGER NOT NULL,
        id_especialidad INTEGER NOT NULL,
        FOREIGN KEY (id_medico) REFERENCES Medico (id_medico),
        FOREIGN KEY (id_especialidad) REFERENCES Especialidad (id_especialidad)
    )''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS HorarioAtencion (
        id_horario INTEGER PRIMARY KEY AUTOINCREMENT,
        id_medico INTEGER NOT NULL,
        dia_semana TEXT NOT NULL, -- "Lunes", "Martes", etc.
        hora_inicio TEXT NOT NULL, -- "HH:MM"
        hora_fin TEXT NOT NULL,
        FOREIGN KEY (id_medico) REFERENCES Medico (id_medico)
    )''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Turno (
        id_turno INTEGER PRIMARY KEY AUTOINCREMENT,
        id_paciente INTEGER NOT NULL,
        id_medico INTEGER NOT NULL,
        id_especialidad INTEGER NOT NULL,
        fecha_hora TEXT NOT NULL, -- Formato ISO: "AAAA-MM-DD HH:MM:SS"
        estado TEXT NOT NULL, -- "Programado", "Cancelado", "Realizado"
        FOREIGN KEY (id_paciente) REFERENCES Paciente (id_paciente),
        FOREIGN KEY (id_medico) REFERENCES Medico (id_medico),
        FOREIGN KEY (id_especialidad) REFERENCES Especialidad (id_especialidad)
    )''')
    
    # Añadimos HistorialClinico y Receta como se pide
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS HistorialClinico (
        id_historial INTEGER PRIMARY KEY AUTOINCREMENT,
        id_paciente INTEGER NOT NULL,
        id_medico INTEGER NOT NULL,
        id_turno INTEGER NOT NULL,
        fecha_hora TEXT NOT NULL,
        diagnostico TEXT,
        observaciones TEXT,
        FOREIGN KEY (id_paciente) REFERENCES Paciente (id_paciente),
        FOREIGN KEY (id_medico) REFERENCES Medico (id_medico),
        FOREIGN KEY (id_turno) REFERENCES Turno (id_turno)
    )''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Receta (
        id_receta INTEGER PRIMARY KEY AUTOINCREMENT,
        id_paciente INTEGER NOT NULL,
        id_medico INTEGER NOT NULL,
        id_turno INTEGER NOT NULL,
        fecha_emision TEXT NOT NULL,
        medicamento TEXT NOT NULL,
        dosis TEXT,
        FOREIGN KEY (id_paciente) REFERENCES Paciente (id_paciente),
        FOREIGN KEY (id_medico) REFERENCES Medico (id_medico),
        FOREIGN KEY (id_turno) REFERENCES Turno (id_turno)
    )''')
    
    conn.commit()
    conn.close()
    print("Base de datos y tablas creadas exitosamente.")

if __name__ == '__main__':
    crear_base_de_datos()