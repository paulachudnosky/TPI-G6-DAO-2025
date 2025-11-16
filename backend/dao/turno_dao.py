import sqlite3
import datetime
from models.turno import Turno
from database import get_db_connection
from . import medico_dao, horario_atencion_dao

DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
DURACION_CONSULTA_MINUTOS = 30  # Duración fija para todas las consultas

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
    Duración fija de 30 minutos para todas las consultas.
    Retorna (True, "Mensaje de éxito/ID") o (False, "Mensaje de error").
    """
    
    # 1. Calcular fechas con duración fija
    try:
        fecha_hora_inicio_dt = datetime.datetime.fromisoformat(fecha_hora_inicio_str)
        fecha_hora_fin_dt = fecha_hora_inicio_dt + datetime.timedelta(minutes=DURACION_CONSULTA_MINUTOS)
        fecha_hora_fin_str = fecha_hora_fin_dt.isoformat()
        
    except Exception as e:
        return (False, f"Error en el formato de fecha: {e}")

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

def obtener_turnos_por_periodo(fecha_inicio, fecha_fin=None, id_medico=None):
    """
    Obtiene todos los turnos dentro de un rango de fechas, incluyendo
    información detallada del paciente, médico y tipo de consulta. 
    Opcionalmente filtra por un médico específico.
    Si fecha_fin no se provee, se usa la fecha y hora actual.
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Corregido: Si fecha_fin es None O una cadena vacía, usar la fecha actual.
        if not fecha_fin:
            fecha_fin = datetime.datetime.now().isoformat()

        query = """
            SELECT 
                t.id_turno, t.fecha_hora_inicio, t.fecha_hora_fin, t.estado,
                p.id_paciente, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
                m.id_medico, m.nombre AS medico_nombre, m.apellido AS medico_apellido,
                tc.id_tipo, tc.nombre AS tipo_consulta_nombre
            FROM Turno t
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            JOIN TipoConsulta tc ON t.id_tipo_consulta = tc.id_tipo
            WHERE t.fecha_hora_inicio BETWEEN ? AND ?
        """
        params = [fecha_inicio, fecha_fin]

        if id_medico:
            query += " AND t.id_medico = ?"
            params.append(id_medico)

        query += " ORDER BY t.fecha_hora_inicio ASC"
        cursor.execute(query, tuple(params))
        
        rows = cursor.fetchall()
        turnos_detallados = []
        for row in rows:
            turno = {
                "id_turno": row[0],
                "fecha_hora_inicio": row[1],
                "fecha_hora_fin": row[2],
                "estado": row[3],
                "paciente": {"id_paciente": row[4], "nombre": row[5], "apellido": row[6]},
                "medico": {"id_medico": row[7], "nombre": row[8], "apellido": row[9]},
                "tipo_consulta": {"id_tipo": row[10], "nombre": row[11]}
            }
            turnos_detallados.append(turno)
        return turnos_detallados

    except sqlite3.Error as e:
        print(f"Error al obtener turnos por período: {e}")
        return []
    finally:
        if conn:
            conn.close()

def contar_pacientes_atendidos_por_periodo(fecha_inicio, id_especialidad, fecha_fin=None):
    """
    Cuenta la cantidad de pacientes únicos atendidos en un período de tiempo para una especialidad específica.
    Un paciente es "atendido" si su turno tiene el estado 'Realizado'.
    - Si fecha_fin no se provee, se usa la fecha y hora actual.
    - El filtro por id_especialidad es obligatorio.
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Corregido: Si fecha_fin es None O una cadena vacía, usar la fecha actual.
        if not fecha_fin:
            fecha_fin = datetime.datetime.now().isoformat()

        # Usamos COUNT(DISTINCT t.id_paciente) para contar pacientes únicos
        query = """
            SELECT COUNT(DISTINCT t.id_paciente) 
            FROM Turno t 
            JOIN Medico m ON t.id_medico = m.id_medico
            WHERE t.estado = 'Asistido'
              AND t.fecha_hora_inicio BETWEEN ? AND ?
              AND m.id_especialidad = ?
        """
        # Corregido: Construir los parámetros DESPUÉS de asignar el valor por defecto a fecha_fin
        params = (fecha_inicio, fecha_fin, id_especialidad)
        cursor.execute(query, tuple(params))
        
        # fetchone() devolverá una tupla, ej: (25,)
        count = cursor.fetchone()[0]
        
        return {"pacientes_atendidos": count}

    except sqlite3.Error as e:
        print(f"Error al contar pacientes atendidos: {e}")
        return {"error": str(e)}
    finally:
        if conn:
            conn.close()

def contar_turnos_por_estado(fecha_inicio=None, fecha_fin=None):
    """
    Cuenta la cantidad de turnos 'Realizado' (asistidos), 'Cancelado' (no asistidos),
    y los que quedaron 'Programado' en el pasado (ausentes).
    - Opcionalmente filtra por un rango de fechas (fecha_inicio, fecha_fin).
    - Si no se proveen fechas, cuenta sobre todos los turnos históricos.
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Construcción de la cláusula WHERE para el rango de fechas
        where_clause = ""
        params = []
        if fecha_inicio and fecha_fin:
            where_clause = "WHERE fecha_hora_inicio BETWEEN ? AND ?"
            params = [fecha_inicio, fecha_fin]
        elif fecha_inicio:
            where_clause = "WHERE fecha_hora_inicio >= ?"
            params = [fecha_inicio]
        elif fecha_fin:
            where_clause = "WHERE fecha_hora_inicio <= ?"
            params = [fecha_fin]

        # Consulta para contar por estado
        query = f"""
            SELECT estado, COUNT(*) 
            FROM Turno 
            {where_clause}
            GROUP BY estado
        """
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()

        # Inicializamos contadores y procesamos resultados
        resultados = {'asistidos': 0, 'no_asistidos_cancelado': 0}
        for row in rows:
            estado, cantidad = row
            if estado == 'Asistido':
                resultados['asistidos'] = cantidad
            elif estado == 'No Asistido':
                resultados['no_asistidos_cancelado'] = cantidad

        # Consulta separada para contar ausentes (no-shows)
        # Son turnos 'Programado' cuya fecha ya pasó
        now_str = datetime.datetime.now().isoformat()
        
        # Adaptamos el where_clause para la consulta de ausentes
        # Si hay un where, lo concatenamos con AND, si no, usamos WHERE
        if where_clause:
            ausentes_where = f"{where_clause} AND estado = 'Programado' AND fecha_hora_inicio < ?"
            params.append(now_str)
        else:
            ausentes_where = "WHERE estado = 'Programado' AND fecha_hora_inicio < ?"
            params = [now_str]

        cursor.execute(f"SELECT COUNT(*) FROM Turno {ausentes_where}", tuple(params))
        resultados['no_asistidos_ausente'] = cursor.fetchone()[0]

        return resultados

    except sqlite3.Error as e:
        print(f"Error al contar turnos por estado: {e}")
        return {"error": str(e)}
    finally:
        if conn:
            conn.close()

def contar_turnos_por_especialidad(fecha_inicio=None, fecha_fin=None):
    """
    Cuenta la cantidad de turnos agrupados por especialidad.
    Opcionalmente filtra por un rango de fechas.
    Retorna una lista de diccionarios con el nombre de la especialidad y la cantidad.
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Base de la consulta
        query = """
            SELECT 
                e.nombre AS especialidad_nombre,
                COUNT(t.id_turno) AS cantidad
            FROM Turno t
            JOIN Medico m ON t.id_medico = m.id_medico
            JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
        """
        
        # Construcción dinámica de la cláusula WHERE
        where_clauses = []
        params = []

        if fecha_inicio:
            where_clauses.append("DATE(t.fecha_hora_inicio) >= ?")
            params.append(fecha_inicio)
        
        if fecha_fin:
            where_clauses.append("DATE(t.fecha_hora_inicio) <= ?")
            params.append(fecha_fin)

        if where_clauses:
            query += " WHERE " + " AND ".join(where_clauses)

        query += " GROUP BY e.id_especialidad, e.nombre ORDER BY cantidad DESC"
        
        cursor.execute(query, tuple(params))
        
        rows = cursor.fetchall()
        resultado = []
        for row in rows:
            resultado.append({
                "especialidad_nombre": row[0],
                "cantidad": row[1]
            })
        return resultado

    except sqlite3.Error as e:
        print(f"Error al contar turnos por especialidad: {e}")
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

def obtener_turnos_por_dia(fecha_str):
    """Obtiene todos los turnos para un día específico para todos los médicos, con datos aplanados."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Usamos la función DATE() de SQLite para comparar solo la parte de la fecha
        # y devolvemos los campos que el frontend espera (ej: paciente_nombre)
        cursor.execute(
            """SELECT t.id_turno, t.fecha_hora_inicio, t.fecha_hora_fin, t.estado,
                      p.id_paciente, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
                      m.id_medico, m.nombre AS medico_nombre, m.apellido AS medico_apellido,
                      tc.id_tipo, tc.nombre AS tipo_consulta_nombre,
                      e.nombre AS especialidad_nombre
               FROM Turno t
               JOIN Paciente p ON t.id_paciente = p.id_paciente
               JOIN Medico m ON t.id_medico = m.id_medico
               JOIN TipoConsulta tc ON t.id_tipo_consulta = tc.id_tipo
               LEFT JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
               WHERE DATE(t.fecha_hora_inicio) = ?
               ORDER BY t.fecha_hora_inicio ASC""",
            (fecha_str,)
        )
        rows = cursor.fetchall()
        # Convertimos cada fila en un diccionario para que sea un JSON válido
        return [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    except sqlite3.Error as e:
        print(f"Error al obtener turnos por día: {e}")
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


def obtener_turno_por_id(id_turno):
    """Obtiene un turno por su ID con información completa del paciente, médico y tipo de consulta."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                t.id_turno, t.fecha_hora_inicio, t.fecha_hora_fin, t.estado,
                t.id_especialidad,
                p.id_paciente, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
                p.dni AS paciente_dni, p.telefono AS paciente_telefono,
                m.id_medico, m.nombre AS medico_nombre, m.apellido AS medico_apellido,
                m.matricula AS medico_matricula,
                e.id_especialidad AS especialidad_id, e.nombre AS especialidad_nombre,
                tc.id_tipo AS tipo_consulta_id, tc.nombre AS tipo_consulta_nombre
            FROM Turno t
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            LEFT JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
            LEFT JOIN TipoConsulta tc ON t.id_tipo_consulta = tc.id_tipo
            WHERE t.id_turno = ?
        """, (id_turno,))
        
        row = cursor.fetchone()
        if not row:
            return None
            
        turno = {
            "id_turno": row[0],
            "fecha_hora_inicio": row[1],
            "fecha_hora_fin": row[2],
            "estado": row[3],
            "id_especialidad": row[4],
            "paciente": {
                "id_paciente": row[5],
                "nombre": row[6],
                "apellido": row[7],
                "dni": row[8],
                "telefono": row[9]
            },
            "medico": {
                "id_medico": row[10],
                "nombre": row[11],
                "apellido": row[12],
                "matricula": row[13]
            },
            "especialidad": {
                "id_especialidad": row[14],
                "nombre": row[15]
            } if row[14] else None,
            "tipo_consulta": {
                "id_tipo": row[16],
                "nombre": row[17]
            } if row[16] else None
        }
        return turno
        
    except sqlite3.Error as e:
        print(f"Error al obtener turno por ID: {e}")
        return None
    finally:
        if conn:
            conn.close()


def obtener_turnos_mes_resumen(anio, mes):
    """
    Obtiene un resumen de turnos agrupados por día para un mes específico.
    Útil para mostrar en un calendario mensual.
    
    Args:
        anio: Año (int)
        mes: Mes (int, 1-12)
    
    Returns:
        Lista de diccionarios: [{"fecha": "2025-11-01", "cantidad": 5}, ...]
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Construir el rango de fechas del mes
        fecha_inicio = f"{anio}-{mes:02d}-01"
        
        # Calcular el último día del mes
        if mes == 12:
            fecha_fin = f"{anio + 1}-01-01"
        else:
            fecha_fin = f"{anio}-{mes + 1:02d}-01"
        
        cursor.execute("""
            SELECT 
                DATE(fecha_hora_inicio) as fecha,
                COUNT(*) as cantidad
            FROM Turno
            WHERE fecha_hora_inicio >= ? AND fecha_hora_inicio < ?
            GROUP BY DATE(fecha_hora_inicio)
            ORDER BY fecha
        """, (fecha_inicio, fecha_fin))
        
        rows = cursor.fetchall()
        resumen = []
        for row in rows:
            resumen.append({
                "fecha": row[0],
                "cantidad": row[1]
            })
        return resumen
        
    except sqlite3.Error as e:
        print(f"Error al obtener resumen de turnos del mes: {e}")
        return []
    finally:
        if conn:
            conn.close()


def actualizar_turno(id_turno, datos):
    """
    Actualiza un turno existente con re-validación de disponibilidad.
    
    Args:
        id_turno: ID del turno a actualizar
        datos: Diccionario con los campos a actualizar
               Campos permitidos: id_medico, fecha_hora_inicio, id_tipo_consulta, id_especialidad
    
    Returns:
        (True, "Mensaje de éxito") o (False, "Mensaje de error")
    """
    conn = None
    try:
        # 1. Obtener el turno actual
        turno_actual = obtener_turno_por_id(id_turno)
        if not turno_actual:
            return (False, "El turno no existe.")
        
        # 2. Preparar los nuevos valores (usar actuales si no se proporciona uno nuevo)
        id_medico = datos.get('id_medico', turno_actual['medico']['id_medico'])
        fecha_hora_inicio_str = datos.get('fecha_hora_inicio', turno_actual['fecha_hora_inicio'])
        id_tipo_consulta = datos.get('id_tipo_consulta', 
                                     turno_actual['tipo_consulta']['id_tipo'] if turno_actual['tipo_consulta'] else None)
        id_especialidad = datos.get('id_especialidad', turno_actual['id_especialidad'])
        
        # 3. Calcular nueva fecha de fin con duración fija
        try:
            fecha_hora_inicio_dt = datetime.datetime.fromisoformat(fecha_hora_inicio_str)
            fecha_hora_fin_dt = fecha_hora_inicio_dt + datetime.timedelta(minutes=DURACION_CONSULTA_MINUTOS)
            fecha_hora_fin_str = fecha_hora_fin_dt.isoformat()
        except Exception as e:
            return (False, f"Error en el formato de fecha: {e}")
        
        # 4. Validar disponibilidad (excluyendo el turno actual de la validación)
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Validar horario de atención
        dia_semana_num = fecha_hora_inicio_dt.weekday()
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
        
        # Validar superposición (excluyendo el turno actual)
        cursor.execute(
            """SELECT COUNT(*) FROM Turno 
               WHERE id_medico = ? AND estado != 'Cancelado' AND id_turno != ?
               AND fecha_hora_fin > ? AND fecha_hora_inicio < ?""",
            (id_medico, id_turno, fecha_hora_inicio_dt.isoformat(), fecha_hora_fin_dt.isoformat())
        )
        
        if cursor.fetchone()[0] > 0:
            return (False, "El médico ya tiene un turno asignado en ese horario.")
        
        # 5. Actualizar el turno
        cursor.execute(
            """UPDATE Turno 
               SET id_medico = ?, fecha_hora_inicio = ?, fecha_hora_fin = ?, 
                   id_tipo_consulta = ?, id_especialidad = ?
               WHERE id_turno = ?""",
            (id_medico, fecha_hora_inicio_str, fecha_hora_fin_str, 
             id_tipo_consulta, id_especialidad, id_turno)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            return (False, "No se pudo actualizar el turno.")
        
        return (True, "Turno actualizado exitosamente.")
        
    except sqlite3.Error as e:
        print(f"Error al actualizar turno: {e}")
        if conn:
            conn.rollback()
        return (False, "Error interno al actualizar el turno.")
    finally:
        if conn:
            conn.close()


def validar_turno_dia_actual(id_turno):
    """
    Valida si un turno corresponde al día actual.
    
    Args:
        id_turno: ID del turno a validar
    
    Returns:
        (True, fecha_turno) si es del día actual, (False, fecha_turno) si no lo es
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT DATE(fecha_hora_inicio) FROM Turno WHERE id_turno = ?",
            (id_turno,)
        )
        
        row = cursor.fetchone()
        if not row:
            return (False, None)
        
        fecha_turno = row[0]
        fecha_actual = datetime.date.today().isoformat()
        
        return (fecha_turno == fecha_actual, fecha_turno)
        
    except sqlite3.Error as e:
        print(f"Error al validar fecha del turno: {e}")
        return (False, None)
    finally:
        if conn:
            conn.close()

def actualizar_turnos_vencidos():
    """
    Actualiza automáticamente los turnos 'Programado' cuya fecha ya pasó
    al estado 'No Asistido'.
    
    Returns:
        Tupla (cantidad_actualizada, mensaje)
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener fecha y hora actual
        ahora = datetime.datetime.now().isoformat()
        
        # Actualizar turnos vencidos
        cursor.execute(
            """UPDATE Turno 
               SET estado = 'No Asistido'
               WHERE estado = 'Programado' 
               AND fecha_hora_fin < ?""",
            (ahora,)
        )
        
        cantidad_actualizada = cursor.rowcount
        conn.commit()
        
        if cantidad_actualizada > 0:
            mensaje = f"{cantidad_actualizada} turno(s) actualizado(s) a 'No Asistido'"
        else:
            mensaje = "No hay turnos vencidos para actualizar"
        
        return (cantidad_actualizada, mensaje)
        
    except sqlite3.Error as e:
        print(f"Error al actualizar turnos vencidos: {e}")
        return (0, f"Error: {e}")
    finally:
        if conn:
            conn.close()


def obtener_turnos_vencidos():
    """
    Obtiene la lista de turnos 'Programado' cuya fecha ya pasó.
    Útil para verificar antes de actualizar.
    
    Returns:
        Lista de turnos vencidos con información básica
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener fecha y hora actual
        ahora = datetime.datetime.now().isoformat()
        
        cursor.execute("""
            SELECT 
                t.id_turno,
                t.fecha_hora_inicio,
                t.fecha_hora_fin,
                p.nombre || ' ' || p.apellido as paciente,
                m.nombre || ' ' || m.apellido as medico
            FROM Turno t
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            WHERE t.estado = 'Programado' 
            AND t.fecha_hora_fin < ?
            ORDER BY t.fecha_hora_inicio DESC
        """, (ahora,))
        
        rows = cursor.fetchall()
        turnos_vencidos = []
        
        for row in rows:
            turnos_vencidos.append({
                "id_turno": row[0],
                "fecha_hora_inicio": row[1],
                "fecha_hora_fin": row[2],
                "paciente": row[3],
                "medico": row[4]
            })
        
        return turnos_vencidos
        
    except sqlite3.Error as e:
        print(f"Error al obtener turnos vencidos: {e}")
        return []
    finally:
        if conn:
            conn.close()
