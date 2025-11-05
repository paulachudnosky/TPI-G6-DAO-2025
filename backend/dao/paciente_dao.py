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
        # Usamos la misma conexión para obtener el paciente recién creado
        return obtener_paciente_por_id(id_paciente_creado, cursor)

    except sqlite3.Error as e:
        print(f"Error al crear paciente: {e}")
        conn.rollback() # Deshacer cambios si algo falla
        raise # Propagamos el error para que la ruta lo maneje
    finally:
        if conn:
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

def obtener_paciente_por_id(id_paciente, cursor_externo=None):
    """Obtiene un paciente por su ID."""
    conn = None
    try:
        if not cursor_externo:
            conn = get_db_connection()
            cursor = conn.cursor()
        else:
            cursor = cursor_externo
        
        cursor.execute("SELECT * FROM Paciente WHERE id_paciente = ?", (id_paciente,))
        row = cursor.fetchone()
    
        if row:
            # Corregimos la creación del objeto Paciente.
            # En lugar de pasar los argumentos por posición (*row), los pasamos por nombre.
            return Paciente(
                id_paciente=row[0], nombre=row[1], apellido=row[2],
                dni=row[3], fecha_nacimiento=row[4], email=row[5], telefono=row[6]
            ).to_dict()
        return None
    finally:
        if conn: # Solo cerramos la conexión si la abrimos en esta función
            conn.close()

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
        # Si se actualizó una fila, devolvemos el paciente actualizado
        if cursor.rowcount > 0:
            return obtener_paciente_por_id(id_paciente, cursor)
        return None # Si no se encontró el ID, devolvemos None
    except sqlite3.Error as e:
        print(f"Error al actualizar paciente: {e}")
        raise
    finally:
        if conn:
            conn.close()

def eliminar_paciente(id_paciente):
    """Elimina un paciente y su historial clínico asociado."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Primero eliminar el historial (por la FK)
        # NOTA: Si el paciente tiene turnos, la FK de la tabla Turno dará error al eliminar al paciente.
        cursor.execute("DELETE FROM HistorialClinico WHERE id_paciente = ?", (id_paciente,))
        # Luego eliminar el paciente
        cursor.execute("DELETE FROM Paciente WHERE id_paciente = ?", (id_paciente,))
        conn.commit()
        # Devolvemos True si se eliminó algo, para que la ruta sepa que fue exitoso
        return cursor.rowcount > 0
    except sqlite3.IntegrityError:
        # Capturamos el error de clave foránea (ej: si el paciente tiene turnos)
        raise ValueError("No se puede eliminar el paciente porque tiene turnos asociados.")
    except sqlite3.Error as e:
        print(f"Error al eliminar paciente: {e}")
        conn.rollback()
        raise
    finally:
        if conn:
            conn.close()