import sqlite3
from models.tipo_consulta import TipoConsulta
from database import get_db_connection 

def crear_tipo_consulta(nombre, descripcion, duracion_minutos):
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
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TipoConsulta")
        rows = cursor.fetchall()
        
        tipos = []
        for row in rows:
            tipo = TipoConsulta(
                id_tipo=row[0], nombre=row[1], descripcion=row[2], duracion_minutos=row[3]
            )
            tipos.append(tipo.to_dict())
        return tipos
    except sqlite3.Error as e:
        print(f"Error al obtener tipos de consulta: {e}")
        return []
    finally:
        if conn:
            conn.close()
