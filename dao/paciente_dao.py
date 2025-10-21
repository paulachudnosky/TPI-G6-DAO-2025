
import sqlite3
from models.paciente import Paciente

def get_db_connection():
    """Establece la conexión con la base de datos."""
    return sqlite3.connect('turnos.db')

def crear_paciente(nombre, apellido, dni, fecha_nacimiento, email, telefono):
    """Crea un nuevo registro de paciente."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Paciente (nombre, apellido, dni, fecha_nacimiento, email, telefono) VALUES (?, ?, ?, ?, ?, ?)",
        (nombre, apellido, dni, fecha_nacimiento, email, telefono)
    )
    conn.commit()
    conn.close()

def obtener_pacientes():
    """Obtiene todos los registros de pacientes."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Paciente")
    rows = cursor.fetchall()
    conn.close()

    pacientes = []
    for row in rows:
        paciente = Paciente(
            id_paciente=row[0], nombre=row[1], apellido=row[2],
            dni=row[3], fecha_nacimiento=row[4], email=row[5], telefono=row[6]
        )
        pacientes.append(paciente.to_dict())
    return pacientes

def obtener_paciente_por_id(id_paciente):
    """Obtiene un paciente por su ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Paciente WHERE id_paciente = ?", (id_paciente,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return Paciente(
            id_paciente=row[0], nombre=row[1], apellido=row[2],
            dni=row[3], fecha_nacimiento=row[4], email=row[5], telefono=row[6]
        ).to_dict()
    return None

def actualizar_paciente(id_paciente, nombre, apellido, dni, fecha_nacimiento, email, telefono):
    """Actualiza los datos de un paciente."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """UPDATE Paciente 
           SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, email = ?, telefono = ?
           WHERE id_paciente = ?""",
        (nombre, apellido, dni, fecha_nacimiento, email, telefono, id_paciente)
    )
    conn.commit()
    conn.close()

def eliminar_paciente(id_paciente):
    """Elimina un paciente de la base de datos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Paciente WHERE id_paciente = ?", (id_paciente,))
    conn.commit()
    conn.close()