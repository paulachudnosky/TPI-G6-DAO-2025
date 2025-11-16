import sqlite3
from models.especialidad import Especialidad
from database import get_db_connection  

def crear_especialidad(nombre, descripcion, activo=True):
    """Crea un nuevo registro de especialidad en la base de datos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Especialidad (nombre, descripcion, activo) VALUES (?, ?, ?)", (nombre, descripcion, activo))
        conn.commit()
        id_creado = cursor.lastrowid
        return obtener_especialidad_por_id(id_creado, cursor)
    except sqlite3.Error as e:
        print(f"Error al crear especialidad: {e}")
        raise
    finally:
        if conn:
            conn.close()

def obtener_especialidades(incluir_inactivos=False):
    """Obtiene todos los registros de especialidades, opcionalmente incluyendo inactivos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if incluir_inactivos:
            cursor.execute("SELECT * FROM Especialidad ORDER BY nombre")
        else:
            cursor.execute("SELECT * FROM Especialidad WHERE activo = 1 ORDER BY nombre")
        rows = cursor.fetchall()
        
        especialidades = []
        for row in rows:
            especialidad = Especialidad(id_especialidad=row[0], nombre=row[1], descripcion=row[2], activo=bool(row[3]))
            especialidades.append(especialidad.to_dict())
        return especialidades
    
    except sqlite3.Error as e:
        print(f"Error al obtener especialidades: {e}")
        return [] # Retorna lista vacía en caso de error
    finally:
        if conn:
            conn.close()

def obtener_especialidad_por_id(id_especialidad, cursor_externo=None):
    """Obtiene una especialidad por su ID, opcionalmente usando un cursor existente."""
    conn = None
    try:
        if not cursor_externo:
            conn = get_db_connection()
            cursor = conn.cursor()
        else:
            cursor = cursor_externo

        cursor.execute("SELECT * FROM Especialidad WHERE id_especialidad = ?", (id_especialidad,))
        row = cursor.fetchone()
        
        if row:
            return Especialidad(id_especialidad=row[0], nombre=row[1], descripcion=row[2], activo=bool(row[3])).to_dict()
        return None
    
    except sqlite3.Error as e:
        print(f"Error al obtener especialidad por ID: {e}")
        return None
    finally:
        if conn: # Solo cerramos la conexión si la abrimos en esta función
            conn.close()

def actualizar_especialidad(id_especialidad, nombre, descripcion, activo):
    """Actualiza los datos de una especialidad."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Especialidad SET nombre = ?, descripcion = ?, activo = ? WHERE id_especialidad = ?",
            (nombre, descripcion, activo, id_especialidad)
        )
        conn.commit()
        if cursor.rowcount > 0:
            return obtener_especialidad_por_id(id_especialidad, cursor)
        return None
    except sqlite3.Error as e:
        print(f"Error al actualizar especialidad: {e}")
        raise
    finally:
        if conn:
            conn.close()

def eliminar_especialidad(id_especialidad):
    """Realiza una baja lógica de una especialidad, marcándola como inactiva."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Se realiza una baja lógica en lugar de un DELETE.
        cursor.execute("UPDATE Especialidad SET activo = 0 WHERE id_especialidad = ?", (id_especialidad,))
        conn.commit()
        return cursor.rowcount > 0
    except sqlite3.IntegrityError as e:
        # Error específico de clave foránea
        if "FOREIGN KEY constraint failed" in str(e):
            raise ValueError("No se puede eliminar la especialidad porque tiene médicos asignados")
        raise  # Re-lanzar si es otro tipo de IntegrityError
    except sqlite3.Error as e:
        print(f"Error al eliminar especialidad: {e}")
    finally:
        if conn:
            conn.close()