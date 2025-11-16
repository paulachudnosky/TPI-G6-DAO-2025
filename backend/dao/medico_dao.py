import sqlite3
from models.medico import Medico
from database import get_db_connection 

def crear_medico(nombre, apellido, matricula, email, id_especialidad, activo=True):
    """Crea un nuevo registro de médico. La especialidad es OBLIGATORIA."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Medico (nombre, apellido, matricula, email, id_especialidad, activo) VALUES (?, ?, ?, ?, ?, ?)",
            (nombre, apellido, matricula, email, id_especialidad, activo)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al crear médico: {e}")
        raise
    finally:
        if conn:
            conn.close()

def obtener_medicos():
    """Obtiene todos los médicos con el nombre de su especialidad."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.id_medico, m.nombre, m.apellido, m.matricula, m.email, m.activo,
                   m.id_especialidad, e.nombre as especialidad_nombre
            FROM Medico m
            INNER JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
        """)
        rows = cursor.fetchall()
        
        medicos = []
        for row in rows:
            medico = {
                "id_medico": row[0],
                "nombre": row[1],
                "apellido": row[2],
                "matricula": row[3],
                "email": row[4],
                "activo": bool(row[5]),
                "id_especialidad": row[6],
                "especialidad_nombre": row[7]
            }
            medicos.append(medico)
        return medicos
        
    except sqlite3.Error as e:
        print(f"Error al obtener médicos: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_medicos_activos():
    """Obtiene solo los médicos activos con el nombre de su especialidad."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.id_medico, m.nombre, m.apellido, m.matricula, m.email, m.activo,
                   m.id_especialidad, e.nombre as especialidad_nombre
            FROM Medico m
            INNER JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
            WHERE m.activo = 1
        """)
        rows = cursor.fetchall()
        
        medicos = []
        for row in rows:
            # Reutilizamos la misma estructura de diccionario para consistencia
            medico = { "id_medico": row[0], "nombre": row[1], "apellido": row[2], "matricula": row[3], "email": row[4], "activo": bool(row[5]), "id_especialidad": row[6], "especialidad_nombre": row[7] }
            medicos.append(medico)
        return medicos
    except sqlite3.Error as e:
        print(f"Error al obtener médicos activos: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_medico_por_id(id_medico):
    """Obtiene un médico por su ID con el nombre de su especialidad."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.id_medico, m.nombre, m.apellido, m.matricula, m.email, m.activo,
                   m.id_especialidad, e.nombre as especialidad_nombre
            FROM Medico m
            INNER JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
            WHERE m.id_medico = ?
        """, (id_medico,))
        row = cursor.fetchone()
        
        if row:
            return {
                "id_medico": row[0],
                "nombre": row[1],
                "apellido": row[2],
                "matricula": row[3],
                "email": row[4],
                "activo": bool(row[5]),
                "id_especialidad": row[6],
                "especialidad_nombre": row[7]
            }
        return None
    except sqlite3.Error as e:
        print(f"Error al obtener médico por ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def actualizar_medico(id_medico, nombre, apellido, matricula, email, id_especialidad, activo):
    """Actualiza los datos de un médico. La especialidad es OBLIGATORIA."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Medico SET nombre = ?, apellido = ?, matricula = ?, email = ?, id_especialidad = ?, activo = ? WHERE id_medico = ?",
            (nombre, apellido, matricula, email, id_especialidad, activo, id_medico)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al actualizar médico: {e}")
        raise
    finally:
        if conn:
            conn.close()

def actualizar_estado_medico(id_medico, activo):
    """Actualiza solo el estado (activo/inactivo) de un médico (Baja/Alta lógica)."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Medico SET activo = ? WHERE id_medico = ?",
            (activo, id_medico)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al actualizar estado del médico: {e}")
        raise
    finally:
        if conn:
            conn.close()
