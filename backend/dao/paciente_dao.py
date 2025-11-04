import sqlite3
import datetime
from models.paciente import Paciente
from database import get_db_connection 
# Importamos el DAO de historial para la creación en cascada
from . import historial_clinico_dao 


def crear_paciente(nombre, apellido, dni, fecha_nacimiento, email, telefono):
    """Crea un nuevo paciente y su historial clínico asociado."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Insertar el paciente
        cursor.execute(
            "INSERT INTO Paciente (nombre, apellido, dni, fecha_nacimiento, email, telefono) VALUES (?, ?, ?, ?, ?, ?)",
            (nombre, apellido, dni, fecha_nacimiento, email, telefono)
        )
        # Obtener el ID del paciente recién creado
        id_paciente_creado = cursor.lastrowid
        
        # Crear el historial clínico para este paciente
        # Usamos el DAO de historial para mantener la lógica encapsulada
        historial_clinico_dao.crear_historial_para_paciente(id_paciente_creado, conn)
        
        conn.commit()
        print(f"Paciente {nombre} {apellido} e historial creados con ID: {id_paciente_creado}")

    except sqlite3.Error as e:
        print(f"Error al crear paciente: {e}")
        conn.rollback() # Deshacer cambios si algo falla
    finally:
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
    try:
        cursor.execute(
            """UPDATE Paciente 
               SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, email = ?, telefono = ?
               WHERE id_paciente = ?""",
            (nombre, apellido, dni, fecha_nacimiento, email, telefono, id_paciente)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al actualizar paciente: {e}")
    finally:
        conn.close()

def eliminar_paciente(id_paciente):
    """Elimina un paciente y su historial clínico asociado."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Primero eliminar el historial (por la FK)
        cursor.execute("DELETE FROM HistorialClinico WHERE id_paciente = ?", (id_paciente,))
        # Luego eliminar el paciente
        cursor.execute("DELETE FROM Paciente WHERE id_paciente = ?", (id_paciente,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al eliminar paciente: {e}")
        conn.rollback()
    finally:
        conn.close()