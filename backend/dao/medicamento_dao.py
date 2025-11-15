import sqlite3
from models.medicamento import Medicamento
from database import get_db_connection 

def crear_medicamento(id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion):
    """Crea un nuevo registro de medicamento en la base de datos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO Medicamento 
               (id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            (id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion)
        )
        conn.commit()
        print("Medicamento creado exitosamente.") 
    except sqlite3.Error as e:
        print(f"Error al crear medicamento: {e}")
        raise
    finally:
        if conn:
            conn.close()

def obtener_medicamentos():
    """Obtiene todos los registros de medicamentos."""
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

# --- Funciones Nuevas (siguiendo el ejemplo) ---

def obtener_medicamento_por_id(id_medicamento):
    """Obtiene un medicamento por su ID."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id_medicamento, id_tipo_medicamento, codigo_nacional, nombre, 
                   descripcion, forma_farmaceutica, presentacion 
            FROM Medicamento 
            WHERE id_medicamento = ?
        """, (id_medicamento,))
        row = cursor.fetchone()
        
        if row:
            medicamento = Medicamento(
                id_medicamento=row[0], 
                id_tipo_medicamento=row[1], 
                codigo_nacional=row[2], 
                nombre=row[3], 
                descripcion=row[4],
                forma_farmaceutica=row[5], 
                presentacion=row[6]
            )
            return medicamento.to_dict()
        return None
    
    except sqlite3.Error as e:
        print(f"Error al obtener medicamento por ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def actualizar_medicamento(id_medicamento, id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion):
    """Actualiza los datos de un medicamento."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE Medicamento SET 
               id_tipo_medicamento = ?, 
               codigo_nacional = ?, 
               nombre = ?, 
               descripcion = ?, 
               forma_farmaceutica = ?, 
               presentacion = ? 
               WHERE id_medicamento = ?""",
            (id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion, id_medicamento)
        )
        conn.commit()
        print("Medicamento actualizado exitosamente.")
    except sqlite3.Error as e:
        print(f"Error al actualizar medicamento: {e}")
        raise
    finally:
        if conn:
            conn.close()

def eliminar_medicamento(id_medicamento):
    """Elimina un medicamento de la base de datos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Medicamento WHERE id_medicamento = ?", (id_medicamento,))
        conn.commit()
        print("Medicamento eliminado exitosamente.")
    except sqlite3.IntegrityError as e:
        # Por si el medicamento es FK en otra tabla (ej. recetas)
        if "FOREIGN KEY constraint failed" in str(e):
            raise ValueError("No se puede eliminar el medicamento porque está en uso")
        raise
    except sqlite3.Error as e:
        print(f"Error al eliminar medicamento: {e}")
    finally:
        if conn:
            conn.close()