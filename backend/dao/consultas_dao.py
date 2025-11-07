import sqlite3
from models.consulta import Consulta
from database import get_db_connection

def _mapear_consulta(row):
    """Función auxiliar para mapear una fila de la BD a un diccionario de consulta."""
    if not row:
        return None
    
    # Columnas esperadas del JOIN:
    # c.id_consulta, c.id_turno, c.motivo_consulta, c.observaciones, t.fecha_hora_inicio,
    # p.id_paciente, p.nombre, p.apellido,
    # m.id_medico, m.nombre, m.apellido
    return {
        "id_consulta": row[0],
        "id_turno": row[1],
        "motivo_consulta": row[2],
        "observaciones": row[3],
        "fecha_turno": row[4],
        "paciente": {
            "id_paciente": row[5],
            "nombre": row[6],
            "apellido": row[7]
        },
        "medico": {
            "id_medico": row[8],
            "nombre": row[9],
            "apellido": row[10]
        }
    }

def crear_consulta(id_turno, motivo_consulta, observaciones):
    """Crea un nuevo registro de consulta."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Consulta (id_turno, motivo_consulta, observaciones) VALUES (?, ?, ?)",
            (id_turno, motivo_consulta, observaciones)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        return obtener_consulta_por_id(nuevo_id)
    except sqlite3.Error as e:
        print(f"Error al crear consulta: {e}")
        conn.rollback()
        raise
    finally:
        if conn:
            conn.close()

def obtener_consultas():
    """Obtiene todas las consultas con información del paciente y médico."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT c.id_consulta, c.id_turno, c.motivo_consulta, c.observaciones, t.fecha_hora_inicio,
                   p.id_paciente, p.nombre, p.apellido,
                   m.id_medico, m.nombre, m.apellido
            FROM Consulta c
            JOIN Turno t ON c.id_turno = t.id_turno
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            ORDER BY t.fecha_hora_inicio DESC
        """)
        rows = cursor.fetchall()
        return [_mapear_consulta(row) for row in rows]
    except sqlite3.Error as e:
        print(f"Error al obtener consultas: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_consulta_por_id(id_consulta):
    """Obtiene una consulta por su ID con información del paciente y médico."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT c.id_consulta, c.id_turno, c.motivo_consulta, c.observaciones, t.fecha_hora_inicio,
                   p.id_paciente, p.nombre, p.apellido,
                   m.id_medico, m.nombre, m.apellido
            FROM Consulta c
            JOIN Turno t ON c.id_turno = t.id_turno
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            WHERE c.id_consulta = ?
        """, (id_consulta,))
        row = cursor.fetchone()
        return _mapear_consulta(row)
    except sqlite3.Error as e:
        print(f"Error al obtener consulta por ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def obtener_consultas_por_paciente(id_paciente):
    """Obtiene todas las consultas de un paciente específico, ordenadas por la más reciente."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT c.id_consulta, c.id_turno, c.motivo_consulta, c.observaciones, t.fecha_hora_inicio,
                   p.id_paciente, p.nombre, p.apellido,
                   m.id_medico, m.nombre, m.apellido
            FROM Consulta c
            JOIN Turno t ON c.id_turno = t.id_turno
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            WHERE p.id_paciente = ?
            ORDER BY t.fecha_hora_inicio DESC
        """, (id_paciente,))
        rows = cursor.fetchall()
        return [_mapear_consulta(row) for row in rows]
    except sqlite3.Error as e:
        print(f"Error al obtener consultas por paciente: {e}")
        return []
    finally:
        if conn:
            conn.close()

def actualizar_consulta(id_consulta, motivo_consulta, observaciones):
    """Actualiza el motivo y las observaciones de una consulta."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE Consulta SET motivo_consulta = ?, observaciones = ? WHERE id_consulta = ?",
            (motivo_consulta, observaciones, id_consulta)
        )
        conn.commit()
        return obtener_consulta_por_id(id_consulta)
    except sqlite3.Error as e:
        print(f"Error al actualizar consulta: {e}")
        raise
    finally:
        if conn:
            conn.close()