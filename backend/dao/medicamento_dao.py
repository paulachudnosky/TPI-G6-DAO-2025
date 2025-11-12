import sqlite3
from models.medicamento import Medicamento
from database import get_db_connection 

def crear_medicamento(id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Medicamento (id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion) VALUES (?, ?, ?, ?, ?, ?)",
            (id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al crear medicamento: {e}")
    finally:
        if conn:
            conn.close()

def obtener_medicamentos():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id_medicamento, id_tipo_medicamento, codigo_nacional, nombre, 
                   descripcion, forma_farmaceutica, presentacion 
            FROM Medicamento
        """)
        rows = cursor.fetchall()
        
        medicamentos = []
        for row in rows:
            medicamento = Medicamento(
                id_medicamento=row[0], 
                id_tipo_medicamento=row[1], 
                codigo_nacional=row[2], 
                nombre=row[3], 
                descripcion=row[4],
                forma_farmaceutica=row[5], 
                presentacion=row[6]
            )
            medicamentos.append(medicamento.to_dict())
        return medicamentos
    except sqlite3.Error as e:
        print(f"Error al obtener medicamentos: {e}")
        return []
    finally:
        if conn:
            conn.close()
