import sqlite3
from models.medico import Medico
from database import get_db_connection 

def crear_medico(nombre, apellido, matricula, email):
    """Crea un nuevo registro de médico."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Medico (nombre, apellido, matricula, email) VALUES (?, ?, ?, ?)",
            (nombre, apellido, matricula, email)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al crear médico: {e}")
    finally:
        if conn:
            conn.close()

def obtener_medicos():
    """Obtiene todos los registros de médicos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Medico")
        rows = cursor.fetchall()
        
        medicos = []
        for row in rows:
            medico = Medico(
                id_medico=row[0], nombre=row[1], apellido=row[2],
                matricula=row[3], email=row[4]
            )
            medicos.append(medico.to_dict())
        return medicos
        
    except sqlite3.Error as e:
        print(f"Error al obtener médicos: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_medico_por_id(id_medico):
    """Obtiene un médico por su ID."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Medico WHERE id_medico = ?", (id_medico,))
        row = cursor.fetchone()
        
        if row:
            return Medico(
                id_medico=row[0], nombre=row[1], apellido=row[2],
                matricula=row[3], email=row[4]
            ).to_dict()
        return None
    except sqlite3.Error as e:
        print(f"Error al obtener médico por ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def actualizar_medico(id_medico, nombre, apellido, matricula, email):
    """Actualiza los datos de un médico."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Medico SET nombre = ?, apellido = ?, matricula = ?, email = ? WHERE id_medico = ?",
            (nombre, apellido, matricula, email, id_medico)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al actualizar médico: {e}")
    finally:
        if conn:
            conn.close()

def eliminar_medico(id_medico):
    """Elimina un médico de la base de datos."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # NOTA: En un sistema real, deberíamos verificar que el médico no tenga turnos futuros.
        # Por ahora, la BD fallará si hay un turno asociado (gracias a PRAGMA foreign_keys = ON).
        cursor.execute("DELETE FROM Medico WHERE id_medico = ?", (id_medico,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al eliminar médico: {e}")
    finally:
        if conn:
            conn.close()