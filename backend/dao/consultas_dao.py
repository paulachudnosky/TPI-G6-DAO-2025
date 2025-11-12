import sqlite3
import datetime
from models.consulta import Consulta
from database import get_db_connection

def _mapear_consulta(row):
    """Función auxiliar para mapear una fila de la BD a un diccionario de consulta."""
    if not row:
        return None
    
    # Columnas esperadas del JOIN:
    # c.id_consulta, c.id_turno, c.motivo_consulta, c.observaciones, t.fecha_hora_inicio,
    # p.id_paciente, p.nombre, p.apellido, p.dni,
    # m.id_medico, m.nombre, m.apellido, m.matricula, e.nombre as especialidad_nombre
    return {
        "id_consulta": row[0],
        "id_turno": row[1],
        "motivo_consulta": row[2],
        "observaciones": row[3],
        "fecha_turno": row[4],
        "paciente": {
            "id_paciente": row[5],
            "nombre": row[6],
            "apellido": row[7],
            "dni": row[8]
        },
        "medico": {
            "id_medico": row[9],
            "nombre": row[10],
            "apellido": row[11],
            "matricula": row[12],
            "especialidad": row[13]
        }
    }

def crear_consulta(id_turno, motivo_consulta, observaciones):
    """
    Crea un nuevo registro de consulta.
    VALIDACIÓN: Solo permite crear consultas para turnos del día actual.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 1. Validar que el turno existe y obtener su fecha
        cursor.execute(
            "SELECT DATE(fecha_hora_inicio) FROM Turno WHERE id_turno = ?",
            (id_turno,)
        )
        row = cursor.fetchone()
        
        if not row:
            raise ValueError("El turno especificado no existe.")
        
        fecha_turno = row[0]
        fecha_actual = datetime.date.today().isoformat()
        
        # 2. Validar que el turno sea del día actual
        if fecha_turno != fecha_actual:
            raise ValueError(f"Solo se pueden crear consultas para turnos del día actual. El turno es del día {fecha_turno}.")
        
        # 3. Validar que no exista ya una consulta para este turno
        cursor.execute(
            "SELECT COUNT(*) FROM Consulta WHERE id_turno = ?",
            (id_turno,)
        )
        if cursor.fetchone()[0] > 0:
            raise ValueError("Ya existe una consulta asociada a este turno.")
        
        # 4. Crear la consulta
        cursor.execute(
            "INSERT INTO Consulta (id_turno, motivo_consulta, observaciones) VALUES (?, ?, ?)",
            (id_turno, motivo_consulta, observaciones)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        
        # 5. Actualizar el estado del turno a "Asistido" automáticamente
        cursor.execute(
            "UPDATE Turno SET estado = 'Asistido' WHERE id_turno = ?",
            (id_turno,)
        )
        conn.commit()
        
        return obtener_consulta_por_id(nuevo_id)
    except sqlite3.Error as e:
        print(f"Error al crear consulta: {e}")
        conn.rollback()
        raise
    except ValueError as ve:
        print(f"Validación fallida: {ve}")
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
                   p.id_paciente, p.nombre, p.apellido, p.dni,
                   m.id_medico, m.nombre, m.apellido, m.matricula, e.nombre
            FROM Consulta c
            JOIN Turno t ON c.id_turno = t.id_turno
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            LEFT JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
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
                   p.id_paciente, p.nombre, p.apellido, p.dni,
                   m.id_medico, m.nombre, m.apellido, m.matricula, e.nombre
            FROM Consulta c
            JOIN Turno t ON c.id_turno = t.id_turno
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            LEFT JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
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
                   p.id_paciente, p.nombre, p.apellido, p.dni,
                   m.id_medico, m.nombre, m.apellido, m.matricula, e.nombre
            FROM Consulta c
            JOIN Turno t ON c.id_turno = t.id_turno
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            LEFT JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
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

def obtener_consultas_por_dia(fecha_str):
    """Obtiene todas las consultas de un día específico, ordenadas por la hora del turno."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT c.id_consulta, c.id_turno, c.motivo_consulta, c.observaciones, t.fecha_hora_inicio,
                   p.id_paciente, p.nombre, p.apellido, p.dni,
                   m.id_medico, m.nombre, m.apellido, m.matricula, e.nombre
            FROM Consulta c
            JOIN Turno t ON c.id_turno = t.id_turno
            JOIN Paciente p ON t.id_paciente = p.id_paciente
            JOIN Medico m ON t.id_medico = m.id_medico
            LEFT JOIN Especialidad e ON m.id_especialidad = e.id_especialidad
            WHERE DATE(t.fecha_hora_inicio) = ?
            ORDER BY t.fecha_hora_inicio ASC
        """, (fecha_str,))
        rows = cursor.fetchall()
        return [_mapear_consulta(row) for row in rows]
    except sqlite3.Error as e:
        print(f"Error al obtener consultas por día: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_receta_por_consulta(id_consulta):
    """Obtiene los detalles de la receta (medicamentos e indicaciones) para una consulta específica."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Primero, obtener los datos de la receta principal
        cursor.execute("SELECT id_receta, fecha_emision FROM Receta WHERE id_consulta = ?", (id_consulta,))
        receta_row = cursor.fetchone()
        if not receta_row:
            return None # No hay receta para esta consulta

        id_receta, fecha_emision = receta_row

        # Segundo, obtener los medicamentos de esa receta
        cursor.execute("""
            SELECT m.id_medicamento, m.nombre, mr.indicaciones, m.forma_farmaceutica, m.presentacion
            FROM MedicamentoReceta mr
            JOIN Medicamento m ON mr.id_medicamento = m.id_medicamento
            WHERE mr.id_receta = ?
        """, (id_receta,))
        
        medicamentos = [
            {
                "id_medicamento": row[0], 
                "nombre": row[1], 
                "indicaciones": row[2],
                "forma_farmaceutica": row[3],
                "presentacion": row[4]
            } for row in cursor.fetchall()
        ]
        
        return {"id_receta": id_receta, "fecha_emision": fecha_emision, "medicamentos": medicamentos}
    finally:
        if conn:
            conn.close()

def registrar_consulta_completa(id_turno, motivo_consulta, observaciones, medicamentos_recetados):
    """
    Realiza una transacción para registrar una consulta completa:
    1. Crea la consulta.
    2. Crea una Receta (documento).
    3. Asocia los medicamentos a esa receta en la tabla MedicamentoReceta, cada uno con sus indicaciones.
    4. Actualiza el estado del turno a 'Asistido'.
    Si alguna operación falla, se revierten todos los cambios.

    :param id_turno: ID del turno que se está finalizando.
    :param motivo_consulta: El motivo de la consulta.
    :param observaciones: Las observaciones del médico.
    :param medicamentos_recetados: Una lista de diccionarios con los medicamentos y sus indicaciones.
                                   Ej: [{'id_medicamento': 1, 'indicaciones': 'Tomar cada 8 horas'}, ...].
    :return: El objeto de la consulta creada si la transacción es exitosa.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Iniciar transacción explícitamente
        cursor.execute("BEGIN TRANSACTION")

        # 1. Crear la consulta
        cursor.execute(
            "INSERT INTO Consulta (id_turno, motivo_consulta, observaciones) VALUES (?, ?, ?)",
            (id_turno, motivo_consulta, observaciones)
        )
        id_consulta_creada = cursor.lastrowid

        # 2. Crear la Receta (el "documento")
        fecha_hoy = __import__('datetime').date.today().isoformat()
        cursor.execute(
            "INSERT INTO Receta (id_consulta, fecha_emision) VALUES (?, ?)",
            (id_consulta_creada, fecha_hoy)
        )
        id_receta_creada = cursor.lastrowid

        # 3. Asociar los medicamentos a la receta en la tabla intermedia, con sus indicaciones
        if medicamentos_recetados:
            items_receta_para_insertar = [
                (med['id_medicamento'], id_receta_creada, med['indicaciones']) for med in medicamentos_recetados
            ]
            cursor.executemany(
                "INSERT INTO MedicamentoReceta (id_medicamento, id_receta, indicaciones) VALUES (?, ?, ?)",
                items_receta_para_insertar
            )

        # 4. Actualizar el estado del turno
        cursor.execute(
            "UPDATE Turno SET estado = 'Asistido' WHERE id_turno = ?",
            (id_turno,)
        )

        conn.commit()  # Confirmar la transacción si todo fue bien
        return obtener_consulta_por_id(id_consulta_creada)

    except sqlite3.Error as e:
        print(f"Error en la transacción de consulta completa. Revirtiendo cambios: {e}")
        conn.rollback()  # Revertir todos los cambios en caso de error
        raise  # Propagar el error para que la capa de servicio lo maneje
    finally:
        if conn:
            conn.close()
            