import sqlite3
from models.tipo_consulta import TipoConsulta
from database import get_db_connection  # Importa la conexión central

def crear_tipo_consulta(nombre, descripcion, duracion_minutos):
    """Crea un nuevo tipo de consulta."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO TipoConsulta (nombre, descripcion, duracion_minutos) VALUES (?, ?, ?)",
            (nombre, descripcion, duracion_minutos)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al crear tipo de consulta: {e}")
    finally:
        if conn:
            conn.close()

def obtener_tipos_consulta():
    """Obtiene todos los tipos de consulta."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TipoConsulta")
        rows = cursor.fetchall()
        
        tipos_consulta = []
        for row in rows:
            tipo = TipoConsulta(
                id_tipo=row[0], nombre=row[1], 
                descripcion=row[2], duracion_minutos=row[3]
            )
            tipos_consulta.append(tipo.to_dict())
        return tipos_consulta
    except sqlite3.Error as e:
        print(f"Error al obtener tipos de consulta: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_tipo_consulta_por_id(id_tipo):
    """Obtiene un tipo de consulta por su ID."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TipoConsulta WHERE id_tipo = ?", (id_tipo,))
        row = cursor.fetchone()
        
        if row:
            tipo = TipoConsulta(
                id_tipo=row[0], nombre=row[1], 
                descripcion=row[2], duracion_minutos=row[3]
            )
            return tipo.to_dict()
        return None
    except sqlite3.Error as e:
        print(f"Error al obtener tipo de consulta por ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def actualizar_tipo_consulta(id_tipo, nombre, descripcion, duracion_minutos):
    """Actualiza un tipo de consulta."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE TipoConsulta SET nombre = ?, descripcion = ?, duracion_minutos = ? WHERE id_tipo = ?",
            (nombre, descripcion, duracion_minutos, id_tipo)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al actualizar tipo de consulta: {e}")
    finally:
        if conn:
            conn.close()

def eliminar_tipo_consulta(id_tipo):
    """Elimina un tipo de consulta."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM TipoConsulta WHERE id_tipo = ?", (id_tipo,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al eliminar tipo de consulta: {e}")
    finally:
        if conn:
            conn.close()

