import sqlite3
import datetime
from models.historial_clinico import HistorialClinico
from database import get_db_connection  

def crear_historial_para_paciente(id_paciente, conn_externa=None):
    """
    Crea un registro de historial para un nuevo paciente.
    Esta función está diseñada para ser llamada por paciente_dao.crear_paciente
    y reutilizar la conexión y transacción.
    """
    # Usa la conexión externa si se pasa, sino, crea una nueva.
    conn = conn_externa if conn_externa else get_db_connection()
    cursor = conn.cursor()
    
    fecha_hoy = datetime.date.today().isoformat()
    estado_default = "Activo"
    
    try:
        cursor.execute(
            """INSERT INTO HistorialClinico 
               (id_paciente, fecha_creacion, fecha_actualizacion, estado) 
               VALUES (?, ?, ?, ?)""",
            (id_paciente, fecha_hoy, fecha_hoy, estado_default)
        )
        # Si la conexión es externa (desde paciente_dao), no hacemos commit aquí.
        # El commit se hará en paciente_dao.
        if not conn_externa:
            conn.commit()
    except sqlite3.Error as e:
        print(f"Error al crear historial: {e}")
        if not conn_externa and conn:
            conn.rollback()
    finally:
        # Solo cerramos la conexión si la creamos en esta función.
        if not conn_externa and conn:
            conn.close()


def obtener_historiales():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM HistorialClinico")
        rows = cursor.fetchall()
        
        historiales = []
        for row in rows:
            historial = HistorialClinico(
                id_historial=row[0], id_paciente=row[1], fecha_creacion=row[2],
                fecha_actualizacion=row[3], grupo_sanguineo=row[4], estado=row[5]
            )
            historiales.append(historial.to_dict())
        return historiales
    except sqlite3.Error as e:
        print(f"Error al obtener historiales: {e}")
        return []
    finally:
        if conn:
            conn.close()

def obtener_historial_por_id_paciente(id_paciente):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM HistorialClinico WHERE id_paciente = ?", (id_paciente,))
        row = cursor.fetchone()
        
        if row:
            return HistorialClinico(
                id_historial=row[0], id_paciente=row[1], fecha_creacion=row[2],
                fecha_actualizacion=row[3], grupo_sanguineo=row[4], estado=row[5]
            ).to_dict()
        return None
    except sqlite3.Error as e:
        print(f"Error al obtener historial por ID de paciente: {e}")
        return None
    finally:
        if conn:
            conn.close()

def actualizar_historial(id_historial, grupo_sanguineo, estado):
    """Actualiza campos del historial. La fecha de actualización se actualiza sola."""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        fecha_hoy = datetime.date.today().isoformat()
        
        cursor.execute(
            """UPDATE HistorialClinico 
               SET grupo_sanguineo = ?, estado = ?, fecha_actualizacion = ?
               WHERE id_historial = ?""",
            (grupo_sanguineo, estado, fecha_hoy, id_historial)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error al actualizar historial: {e}")
    finally:
        if conn:
            conn.close()
