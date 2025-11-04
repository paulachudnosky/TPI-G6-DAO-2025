import sqlite3
import datetime
from models.turno import Turno
from database import get_db_connection
from . import tipo_consulta_dao, medico_dao, horario_atencion_dao

DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

def validar_disponibilidad(id_medico, fecha_hora_inicio_dt, fecha_hora_fin_dt):
    """
    Valida la disponibilidad del médico.
    Retorna (True, "Mensaje de éxito") o (False, "Mensaje de error").
    """
    
    # 1. Validación de Horario de Atención (HorarioAtencion)
    dia_semana_num = fecha_hora_inicio_dt.weekday() # Lunes es 0, Domingo es 6
    dia_semana_str = DIAS_SEMANA[dia_semana_num]
    
    hora_inicio_str = fecha_hora_inicio_dt.strftime("%H:%M")
    hora_fin_str = fecha_hora_fin_dt.strftime("%H:%M")

    horarios_medico = horario_atencion_dao.obtener_horarios_por_medico(id_medico)
    
    en_horario = False
    for horario in horarios_medico:
        if horario['dia_semana'] == dia_semana_str:
            if hora_inicio_str >= horario['hora_inicio'] and hora_fin_str <= horario['hora_fin']:
                en_horario = True
                break
    
    if not en_horario:
        return (False, f"El médico no atiende en el día y hora seleccionados ({dia_semana_str} de {hora_inicio_str} a {hora_fin_str}).")

    # 2. Validación de Superposición de Turnos (Turno)
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # SQL para detectar superposición: (FinExistente > InicioNuevo) AND (InicioExistente < FinNuevo)
        cursor.execute(
            """SELECT COUNT(*) FROM Turno 
               WHERE id_medico = ? AND estado != 'Cancelado'
               AND fecha_hora_fin > ? AND fecha_hora_inicio < ?""",
            (id_medico, fecha_hora_inicio_dt.isoformat(), fecha_hora_fin_dt.isoformat())
        )
        
        if cursor.fetchone()[0] > 0:
            return (False, "El médico ya tiene un turno asignado en ese horario.")
            
    except sqlite3.Error as e:
        print(f"Error al validar superposición: {e}")
        return (False, "Error interno al validar el turno.")
    finally:
        if conn:
            conn.close()

    return (True, "Horario disponible.")


def crear_turno(id_paciente, id_medico, id_tipo_consulta, fecha_hora_inicio_str, id_especialidad=None):
    """
    Crea un nuevo turno CON VALIDACIONES.
    Retorna (True, "Mensaje de éxito/ID") o (False, "Mensaje de error").
    """
    
    # 1. Calcular fechas
    try:
        tipo_consulta = tipo_consulta_dao.obtener_tipo_consulta_por_id(id_tipo_consulta)
        if not tipo_consulta:
            return (False, "El tipo de consulta no existe.")
        
        duracion = tipo_consulta['duracion_minutos']
        fecha_hora_inicio_dt = datetime.datetime.fromisoformat(fecha_hora_inicio_str)
        fecha_hora_fin_dt = fecha_hora_inicio_dt + datetime.timedelta(minutes=duracion)
        fecha_hora_fin_str = fecha_hora_fin_dt.isoformat()
        
    except Exception as e:
        return (False, f"Error en el formato de fecha o tipo de consulta: {e}")

    # 2. Validar disponibilidad
    es_valido, mensaje = validar_disponibilidad(id_medico, fecha_hora_inicio_dt, fecha_hora_fin_dt)
    
    if not es_valido:
        return (False, mensaje)

    # 3. Crear el turno (si todo es válido)
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        estado_default = "Programado"
        
        cursor.execute(
            """INSERT INTO Turno 
               (id_paciente, id_medico, id_especialidad, id_tipo_consulta, fecha_hora_inicio, fecha_hora_fin, estado) 
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (id_paciente, id_medico, id_especialidad, id_tipo_consulta, fecha_hora_inicio_str, fecha_hora_fin_str, estado_default)
        )
        nuevo_id = cursor.lastrowid
        conn.commit()
        return (True, f"Turno creado exitosamente con ID: {nuevo_id}")
        
    except sqlite3.Error as e:
        print(f"Error al crear turno: {e}")
        return (False, "Error interno al guardar el turno.")
    finally:
        if conn:
            conn.close()

def obtener_turnos():
    """Obtiene todos los turnos (podría ser muy largo, idealmente filtrar)."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Turno")
        rows = cursor.fetchall()
        
        turnos = []
        for row in rows:
            turno = Turno(
                id_turno=row[0], id_paciente=row[1], id_medico=row[2], id_especialidad=row[3],
                id_tipo_consulta=row[4], fecha_hora_inicio=row[5], fecha_hora_fin=row[6], estado=row[7]
            )
            turnos.append(turno.to_dict())
        return turnos
    except sqlite3.Error as e:
        print(f"Error al obtener turnos: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_turnos_por_medico(id_medico):
    """Obtiene todos los turnos de un médico específico."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Turno WHERE id_medico = ?", (id_medico,))
        rows = cursor.fetchall()
        
        turnos = []
        for row in rows:
            turno = Turno(
                id_turno=row[0], id_paciente=row[1], id_medico=row[2], id_especialidad=row[3],
                id_tipo_consulta=row[4], fecha_hora_inicio=row[5], fecha_hora_fin=row[6], estado=row[7]
            )
            turnos.append(turno.to_dict())
        return turnos
    except sqlite3.Error as e:
        print(f"Error al obtener turnos del médico: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_turnos_por_dia_y_medico(id_medico, fecha_str):
    """Obtiene todos los turnos de un médico para un día específico."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Usamos la función DATE() de SQLite para comparar solo la parte de la fecha
        cursor.execute(
            "SELECT * FROM Turno WHERE id_medico = ? AND DATE(fecha_hora_inicio) = ?",
            (id_medico, fecha_str)
        )
        rows = cursor.fetchall()
        
        turnos = []
        for row in rows:
            turno = Turno(*row) # Desempaqueta la fila en los argumentos del constructor
            turnos.append(turno.to_dict())
        return turnos
    except sqlite3.Error as e:
        print(f"Error al obtener turnos por día y médico: {e}")
        return []
    finally:
        if conn:
            conn.close()

def actualizar_estado_turno(id_turno, nuevo_estado):
    """Actualiza solo el estado de un turno (ej: 'Cancelado', 'Realizado')."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE Turno SET estado = ? WHERE id_turno = ?", (nuevo_estado, id_turno))
        conn.commit()
        
        if cursor.rowcount == 0:
            return (False, "El turno no fue encontrado.")
        return (True, "Estado del turno actualizado.")
    except sqlite3.Error as e:
        print(f"Error al actualizar estado del turno: {e}")
        return (False, "Error interno al actualizar el turno.")
    finally:
        if conn:
            conn.close()

def eliminar_turno(id_turno):
    """Elimina un turno (usar con precaución, mejor cancelar)."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Turno WHERE id_turno = ?", (id_turno,))
        conn.commit()
        if cursor.rowcount == 0:
            return (False, "El turno no fue encontrado.")
        return (True, "Turno eliminado.")
    except sqlite3.Error as e:
        print(f"Error al eliminar turno: {e}")
        return (False, "Error interno al eliminar el turno.")
    finally:
        if conn:
            conn.close()