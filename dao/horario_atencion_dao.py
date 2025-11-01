import sqlite3
from models.horario_atencion import HorarioAtencion
from database import get_db_connection 

def crear_horario(id_medico, dia_semana, hora_inicio, hora_fin):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO HorarioAtencion (id_medico, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)",
            (id_medico, dia_semana, hora_inicio, hora_fin)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al crear horario: {e}")
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

def eliminar_horario(id_horario):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM HorarioAtencion WHERE id_horario = ?", (id_horario,))
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al eliminar horario: {e}")
    finally:
        if conn:
            conn.close()

