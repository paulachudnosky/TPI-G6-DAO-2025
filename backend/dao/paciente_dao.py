import sqlite3
import datetime
from models.paciente import Paciente
from database import get_db_connection 


def crear_paciente(nombre, apellido, dni, fecha_nacimiento, email, telefono, activo=True):
    """Crea un nuevo paciente y su historial clínico asociado."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Insertar el paciente
        cursor.execute(
            "INSERT INTO Paciente (nombre, apellido, dni, fecha_nacimiento, email, telefono, activo) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (nombre, apellido, dni, fecha_nacimiento, email, telefono, activo)
        )
        # Obtener el ID del paciente recién creado
        id_paciente_creado = cursor.lastrowid
        
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

def obtener_pacientes(incluir_inactivos=False):
    """Obtiene todos los registros de pacientes, opcionalmente incluyendo inactivos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    if incluir_inactivos:
        cursor.execute("SELECT * FROM Paciente ORDER BY apellido, nombre")
    else:
        cursor.execute("SELECT * FROM Paciente WHERE activo = 1 ORDER BY apellido, nombre")
    rows = cursor.fetchall()
    conn.close()

    pacientes = []
    for row in rows:
        paciente = Paciente(
            id_paciente=row[0], nombre=row[1], apellido=row[2],
            dni=row[3], fecha_nacimiento=row[4], email=row[5], telefono=row[6],
            activo=bool(row[7])
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
            return Paciente( # activo es la columna 7 (índice 7)
                id_paciente=row[0], nombre=row[1], apellido=row[2],
                dni=row[3], fecha_nacimiento=row[4], email=row[5], telefono=row[6], activo=bool(row[7])
            ).to_dict()
        return None
    finally:
        if conn: # Solo cerramos la conexión si la abrimos en esta función
            conn.close()

def actualizar_paciente(id_paciente, nombre, apellido, dni, fecha_nacimiento, email, telefono, activo):
    """Actualiza los datos de un paciente."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """UPDATE Paciente 
               SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, email = ?, telefono = ?, activo = ?
               WHERE id_paciente = ?""",
            (nombre, apellido, dni, fecha_nacimiento, email, telefono, activo, id_paciente)
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
    """Realiza una baja lógica de un paciente, marcándolo como inactivo."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # NOTA: Si el paciente tiene turnos, la FK de la tabla Turno dará error al eliminar al paciente.
        # Se realiza una baja lógica en lugar de un DELETE.
        cursor.execute("UPDATE Paciente SET activo = 0 WHERE id_paciente = ?", (id_paciente,))
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