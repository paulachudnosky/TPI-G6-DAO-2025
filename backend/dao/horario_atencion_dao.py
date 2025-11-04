import sqlite3
from models.horario_atencion import HorarioAtencion
from database import get_db_connection 

def _horario_existente_para_dia(cursor, id_medico, dia_semana, id_horario_a_excluir=None):
    """
    Función interna para verificar si ya existe un horario para un médico en un día específico.
    Si se provee id_horario_a_excluir, lo ignora en la búsqueda (útil para actualizaciones).
    """
    query = "SELECT 1 FROM HorarioAtencion WHERE id_medico = ? AND dia_semana = ?"
    params = [id_medico, dia_semana]

    if id_horario_a_excluir:
        query += " AND id_horario != ?"
        params.append(id_horario_a_excluir)

    cursor.execute(query, params)
    return cursor.fetchone() is not None

def crear_horario(id_medico, dia_semana, hora_inicio, hora_fin):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if _horario_existente_para_dia(cursor, id_medico, dia_semana):
            return {"error": f"Ya existe un horario para el médico en el día '{dia_semana}'."}

        cursor.execute(
            "INSERT INTO HorarioAtencion (id_medico, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)",
            (id_medico, dia_semana, hora_inicio, hora_fin)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        return obtener_horario_por_id(nuevo_id)
    except sqlite3.Error as e:
        print(f"Error al crear horario: {e}")
        return {"error": "Error interno al crear el horario."}
    finally:
        if conn:
            conn.close()

def obtener_horario_por_id(id_horario):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM HorarioAtencion WHERE id_horario = ?", (id_horario,))
        row = cursor.fetchone()
        if row:
            horario = HorarioAtencion(
                id_horario=row[0], id_medico=row[1], dia_semana=row[2],
                hora_inicio=row[3], hora_fin=row[4]
            )
            return horario.to_dict()
        return None
    except sqlite3.Error as e:
        print(f"Error al obtener horario por ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def obtener_horarios_por_medico(id_medico):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM HorarioAtencion WHERE id_medico = ?", (id_medico,))
        rows = cursor.fetchall()
        
        horarios = []
        for row in rows:
            horario = HorarioAtencion(
                id_horario=row[0], id_medico=row[1], dia_semana=row[2],
                hora_inicio=row[3], hora_fin=row[4]
            )
            horarios.append(horario.to_dict())
        return horarios
    except sqlite3.Error as e:
        print(f"Error al obtener horarios: {e}")
        return []
    finally:
        if conn:
            conn.close()

def actualizar_horario(id_horario, id_medico, dia_semana, hora_inicio, hora_fin):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if _horario_existente_para_dia(cursor, id_medico, dia_semana, id_horario_a_excluir=id_horario):
            return {"error": f"Ya existe otro horario para el médico en el día '{dia_semana}'."}

        cursor.execute(
            """UPDATE HorarioAtencion 
               SET id_medico = ?, dia_semana = ?, hora_inicio = ?, hora_fin = ?
               WHERE id_horario = ?""",
            (id_medico, dia_semana, hora_inicio, hora_fin, id_horario)
        )
        conn.commit()
        if cursor.rowcount > 0:
            return obtener_horario_por_id(id_horario)
        return None
    except sqlite3.Error as e:
        print(f"Error al actualizar horario: {e}")
        return {"error": "Error interno al actualizar el horario."}
    finally:
        if conn:
            conn.close()

def eliminar_horario(id_horario):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM HorarioAtencion WHERE id_horario = ?", (id_horario,))
        conn.commit()
        # Devuelve True si se eliminó una fila, False en caso contrario.
        return cursor.rowcount > 0
    except sqlite3.Error as e:
        print(f"Error al eliminar horario: {e}")
        return False
    finally:
        if conn:
            conn.close()
