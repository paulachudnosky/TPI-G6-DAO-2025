import sqlite3
from models.tipo_medicamento import TipoMedicamento
from database import get_db_connection 

def crear_tipo_medicamento(nombre):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO TipoMedicamento (nombre) VALUES (?)", (nombre,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al crear tipo de medicamento: {e}")
    finally:
        if conn:
            conn.close()

def obtener_tipos_medicamento():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TipoMedicamento")
        rows = cursor.fetchall()
        
        tipos = []
        for row in rows:
            tipo = TipoMedicamento(id_tipo_medicamento=row[0], nombre=row[1])
            tipos.append(tipo.to_dict())
        return tipos
    except sqlite3.Error as e:
        print(f"Error al obtener tipos de medicamento: {e}")
        return []
    finally:
        if conn:
            conn.close()
