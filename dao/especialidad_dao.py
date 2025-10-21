import sqlite3
from models.especialidad import Especialidad

def get_db_connection():
    """Establece la conexión con la base de datos."""
    return sqlite3.connect('turnos.db')

def crear_especialidad(nombre, descripcion):
    """Crea un nuevo registro de especialidad en la base de datos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Especialidad (nombre, descripcion) VALUES (?, ?)", (nombre, descripcion))
    conn.commit()
    conn.close()

def obtener_especialidades():
    """Obtiene todos los registros de especialidades."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Especialidad")
    rows = cursor.fetchall()
    conn.close()
    
    especialidades = []
    for row in rows:
        especialidad = Especialidad(id_especialidad=row[0], nombre=row[1], descripcion=row[2])
        especialidades.append(especialidad.to_dict())
    return especialidades

def obtener_especialidad_por_id(id_especialidad):
    """Obtiene una especialidad por su ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Especialidad WHERE id_especialidad = ?", (id_especialidad,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return Especialidad(id_especialidad=row[0], nombre=row[1], descripcion=row[2]).to_dict()
    return None

def actualizar_especialidad(id_especialidad, nombre, descripcion):
    """Actualiza los datos de una especialidad."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE Especialidad SET nombre = ?, descripcion = ? WHERE id_especialidad = ?",
        (nombre, descripcion, id_especialidad)
    )
    conn.commit()
    conn.close()

def eliminar_especialidad(id_especialidad):
    """Elimina una especialidad de la base de datos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Especialidad WHERE id_especialidad = ?", (id_especialidad,))
    conn.commit()
    conn.close()