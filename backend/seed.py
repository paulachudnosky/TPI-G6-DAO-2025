import sqlite3
import datetime
from database import get_db_connection  # Importa la conexión central

def poblar_base_de_datos():
    """
    Puebla la base de datos con datos de ejemplo en UNA SOLA TRANSACCIÓN.
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # --- 1. Poblar Especialidades ---
        especialidades = [
            ('Cardiología', 'Diagnóstico y tratamiento de enfermedades cardiovasculares.'),
            ('Dermatología', 'Tratamiento de enfermedades de la piel.'),
            ('Pediatría', 'Atención médica de bebés, niños y adolescentes.'),
            ('Traumatología', 'Tratamiento de lesiones del aparato locomotor.')
        ]
        cursor.executemany("INSERT OR IGNORE INTO Especialidad (nombre, descripcion) VALUES (?, ?)", especialidades)

        # --- 2. Poblar Médicos ---
        medicos = [
            ('Ana', 'García', 'MP-9876', 'ana.garcia@clinic.com', 1),
            ('Carlos', 'Lopez', 'MP-5432', 'carlos.lopez@clinic.com', 2),
            ('Laura', 'Martinez', 'MP-1122', 'laura.martinez@clinic.com', 3),
            ('Roberto', 'Sanchez', 'MP-3344', 'roberto.sanchez@clinic.com', 4)
        ]
        cursor.executemany("INSERT OR IGNORE INTO Medico (nombre, apellido, matricula, email, id_especialidad) VALUES (?, ?, ?, ?, ?)", medicos)

        # --- 3. Poblar Pacientes ---
        # (Solo si la tabla está vacía)
        cursor.execute("SELECT COUNT(*) FROM Paciente")
        if cursor.fetchone()[0] == 0:
            print("Poblando pacientes y creando historiales...")
            pacientes = [
                ('Juan', 'Perez', '30.123.456', '1983-05-20', 'juan.perez@email.com', '351-111222'),
                ('Maria', 'Gomez', '35.456.789', '1990-11-02', 'maria.gomez@email.com', '351-333444'),
                ('Lucas', 'Torres', '40.789.123', '1998-02-14', 'lucas.torres@email.com', '351-555666'),
                ('Sofia', 'Diaz', '38.987.654', '1995-07-30', 'sofia.diaz@email.com', '351-777888')
            ]
            
            fecha_hoy = datetime.date.today().isoformat()
            
            for paciente in pacientes:
                # Insertar el paciente
                cursor.execute(
                    "INSERT INTO Paciente (nombre, apellido, dni, fecha_nacimiento, email, telefono) VALUES (?, ?, ?, ?, ?, ?)",
                    paciente
                )
                id_paciente_creado = cursor.lastrowid
                
                # Insertar su historial clínico asociado (relación 1-a-1)
                cursor.execute(
                    """INSERT INTO HistorialClinico 
                       (id_paciente, fecha_creacion, fecha_actualizacion, estado) 
                       VALUES (?, ?, ?, ?)""",
                    (id_paciente_creado, fecha_hoy, fecha_hoy, "Activo")
                )

            # Actualizar historiales con datos específicos
            cursor.execute("UPDATE HistorialClinico SET grupo_sanguineo = 'A+' WHERE id_paciente = 1")
            cursor.execute("UPDATE HistorialClinico SET grupo_sanguineo = 'O-' WHERE id_paciente = 2")
            cursor.execute("UPDATE HistorialClinico SET grupo_sanguineo = 'B+' WHERE id_paciente = 3")
            cursor.execute("UPDATE HistorialClinico SET grupo_sanguineo = 'AB+' WHERE id_paciente = 4")
        else:
            print("Pacientes ya existentes, omitiendo poblamiento.")


        # --- 4. Poblar Tipos de Consulta ---
        tipos_consulta = [
            ('Primera Vez', 'Primera consulta con el especialista.', 30),
            ('Control', 'Consulta de seguimiento o control.', 15),
            ('Urgencia', 'Consulta no programada por una urgencia.', 20)
        ]
        cursor.executemany("INSERT OR IGNORE INTO TipoConsulta (nombre, descripcion, duracion_minutos) VALUES (?, ?, ?)", tipos_consulta)

        # --- 5. Poblar Tipos de Medicamento ---
        tipos_medicamento = [
            ('Analgésico',),
            ('Antibiótico',),
            ('Antiinflamatorio',)
        ]
        cursor.executemany("INSERT OR IGNORE INTO TipoMedicamento (nombre) VALUES (?)", tipos_medicamento)

        # --- 6. Poblar Medicamentos ---
        medicamentos = [
            (1, 'NAC-1001', 'Paracetamol', 'Analgésico para fiebre y dolor.'),
            (3, 'NAC-1002', 'Ibuprofeno', 'Antiinflamatorio no esteroideo.'),
            (2, 'NAC-2001', 'Amoxicilina', 'Antibiótico de amplio espectro.')
        ]
        cursor.executemany("INSERT OR IGNORE INTO Medicamento (id_tipo_medicamento, codigo_nacional, nombre, descripcion) VALUES (?, ?, ?, ?)", medicamentos)

        # --- 7. Poblar Horarios de Atención ---
        horarios = [
            (1, 'Lunes', '09:00', '13:00'), # Dra. García (ID 1)
            (1, 'Miércoles', '09:00', '13:00'),
            (2, 'Martes', '14:00', '18:00'), # Dr. Lopez (ID 2)
            (2, 'Jueves', '14:00', '18:00'),
            (3, 'Viernes', '08:00', '12:00') # Dra. Martinez (ID 3)
        ]
        cursor.executemany("INSERT OR IGNORE INTO HorarioAtencion (id_medico, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)", horarios)

        # --- 8. Poblar Turnos de Ejemplo ---
        cursor.execute("SELECT COUNT(*) FROM Turno")
        if cursor.fetchone()[0] == 0:
            print("Poblando turnos...")
            # (id_paciente, id_medico, id_especialidad, id_tipo_consulta, fecha_hora_inicio, fecha_hora_fin, estado)
            turnos_ejemplo = [
                # Turno VÁLIDO para Dra. García (ID 1) el próximo Lunes a las 10:00 (Tipo Consulta 2 = 15 min)
                # (Asumimos que el 2025-11-03 es Lunes)
                (1, 1, 1, 2, '2025-11-03 10:00:00', '2025-11-03 10:15:00', 'Programado'),
                
                # Turno VÁLIDO para Dra. García (ID 1) el mismo Lunes a las 10:30 (Tipo Consulta 1 = 30 min)
                (2, 1, 1, 1, '2025-11-03 10:30:00', '2025-11-03 11:00:00', 'Programado'),
                
                # Turno VÁLIDO para Dr. Lopez (ID 2) el próximo Martes a las 15:00 (Tipo Consulta 2 = 15 min)
                # (Asumimos que el 2025-11-04 es Martes)
                (3, 2, 4, 2, '2025-11-04 15:00:00', '2025-11-04 15:15:00', 'Programado')
            ]
            cursor.executemany(
                """INSERT INTO Turno 
                   (id_paciente, id_medico, id_especialidad, id_tipo_consulta, fecha_hora_inicio, fecha_hora_fin, estado) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                turnos_ejemplo
            )

        # --- COMMIT FINAL ---
        conn.commit()
        print("Base de datos poblada con datos de ejemplo exitosamente.")
    
    except sqlite3.Error as e:
        print(f"Ocurrió un error al poblar la base de datos: {e}")
        if conn:
            conn.rollback() # Deshacer todo si algo falla
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    poblar_base_de_datos()

