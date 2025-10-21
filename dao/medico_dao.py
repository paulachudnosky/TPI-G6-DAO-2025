import sqlite3
from models.medico import Medico

def get_db_connection():
    """Establece la conexión con la base de datos."""
    return sqlite3.connect('turnos.db')

def crear_medico(nombre, apellido, matricula, email):
    """Crea un nuevo registro de médico."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Medico (nombre, apellido, matricula, email) VALUES (?, ?, ?, ?)",
        (nombre, apellido, matricula, email)
    )
    conn.commit()
    conn.close()

def obtener_medicos():
    """Obtiene todos los registros de médicos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Medico")
    rows = cursor.fetchall()
    conn.close()

    medicos = []
    for row in rows:
        medico = Medico(
            id_medico=row[0], nombre=row[1], apellido=row[2],
            matricula=row[3], email=row[4]
        )
        medicos.append(medico.to_dict())
    return medicos

def obtener_medico_por_id(id_medico):
    """Obtiene un médico por su ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Medico WHERE id_medico = ?", (id_medico,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return Medico(
            id_medico=row[0], nombre=row[1], apellido=row[2],
            matricula=row[3], email=row[4]
        ).to_dict()
    return None

def actualizar_medico(id_medico, nombre, apellido, matricula, email):
    """Actualiza los datos de un médico."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE Medico SET nombre = ?, apellido = ?, matricula = ?, email = ? WHERE id_medico = ?",
        (nombre, apellido, matricula, email, id_medico)
    )
    conn.commit()
    conn.close()

def eliminar_medico(id_medico):
    """Elimina un médico de la base de datos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Medico WHERE id_medico = ?", (id_medico,))
    conn.commit()
    conn.close()