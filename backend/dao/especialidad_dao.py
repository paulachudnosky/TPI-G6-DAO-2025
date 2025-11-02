import sqlite3
from models.especialidad import Especialidad
from database import get_db_connection  

def crear_especialidad(nombre, descripcion):
    """Crea un nuevo registro de especialidad en la base de datos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Especialidad (nombre, descripcion) VALUES (?, ?)", (nombre, descripcion))
        conn.commit()
        print("Especialidad creada exitosamente.")
    except sqlite3.Error as e:
        print(f"Error al crear especialidad: {e}")
    finally:
        if conn:
            conn.close()

def obtener_especialidades():
    """Obtiene todos los registros de especialidades."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Especialidad")
        rows = cursor.fetchall()
        
        especialidades = []
        for row in rows:
            especialidad = Especialidad(id_especialidad=row[0], nombre=row[1], descripcion=row[2])
            especialidades.append(especialidad.to_dict())
        return especialidades
    
    except sqlite3.Error as e:
        print(f"Error al obtener especialidades: {e}")
        return [] # Retorna lista vacía en caso de error
    finally:
        if conn:
            conn.close()

def obtener_especialidad_por_id(id_especialidad):
    """Obtiene una especialidad por su ID."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Especialidad WHERE id_especialidad = ?", (id_especialidad,))
        row = cursor.fetchone()
        
        if row:
            return Especialidad(id_especialidad=row[0], nombre=row[1], descripcion=row[2]).to_dict()
        return None
    
    except sqlite3.Error as e:
        print(f"Error al obtener especialidad por ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def actualizar_especialidad(id_especialidad, nombre, descripcion):
    """Actualiza los datos de una especialidad."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Especialidad SET nombre = ?, descripcion = ? WHERE id_especialidad = ?",
            (nombre, descripcion, id_especialidad)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al actualizar especialidad: {e}")
    finally:
        if conn:
            conn.close()

def eliminar_especialidad(id_especialidad):
    """Elimina una especialidad de la base de datos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Especialidad WHERE id_especialidad = ?", (id_especialidad,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al eliminar especialidad: {e}")
    finally:
        if conn:
            conn.close()