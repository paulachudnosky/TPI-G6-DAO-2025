import sqlite3
import datetime
import random
from database import get_db_connection  # Importa la conexión central

estados_turno = ["Asistido", "No Asistido"]

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
            ('Traumatología', 'Tratamiento de lesiones del aparato locomotor.'),
            ('Ginecología', 'Salud del sistema reproductor femenino.'),
            ('Oftalmología', 'Salud de los ojos.'),
            ('Urología', 'Salud del sistema urinario y reproductor masculino.'),
            ('Neurología', 'Trastornos del sistema nervioso.')
        ]
        cursor.executemany("INSERT OR IGNORE INTO Especialidad (nombre, descripcion, activo) VALUES (?, ?, 1)", especialidades)

        # --- 2. Poblar Médicos ---
        medicos = [
            # 4 existentes
            ('Ana', 'García', 'MP-9876', 'ana.garcia@clinic.com', 1, True),
            ('Carlos', 'Lopez', 'MP-5432', 'carlos.lopez@clinic.com', 2, True),
            ('Laura', 'Martinez', 'MP-1122', 'laura.martinez@clinic.com', 3, True),
            ('Roberto', 'Sanchez', 'MP-3344', 'roberto.sanchez@clinic.com', 4, True),
            # 11 nuevos
            ('Martín', 'Fierro', 'MP-2468', 'martin.fierro@clinic.com', 5, True),
            ('Elena', 'Rodriguez', 'MP-1357', 'elena.rodriguez@clinic.com', 5, True),
            ('Jorge', 'Borges', 'MP-9753', 'jorge.borges@clinic.com', 6, True),
            ('Victoria', 'Ocampo', 'MP-8642', 'victoria.ocampo@clinic.com', 6, True),
            ('Julio', 'Cortazar', 'MP-1234', 'julio.cortazar@clinic.com', 7, True),
            ('Silvina', 'Bullrich', 'MP-5678', 'silvina.bullrich@clinic.com', 7, True),
            ('Adolfo', 'Casares', 'MP-4321', 'adolfo.casares@clinic.com', 8, True),
            ('Alejandra', 'Pizarnik', 'MP-8765', 'alejandra.pizarnik@clinic.com', 8, True),
            ('Ernesto', 'Sabato', 'MP-1011', 'ernesto.sabato@clinic.com', 1, True),
            ('Alfonsina', 'Storni', 'MP-1213', 'alfonsina.storni@clinic.com', 2, True),
            ('Leopoldo', 'Lugones', 'MP-1415', 'leopoldo.lugones@clinic.com', 3, True)
        ]
        cursor.executemany("INSERT OR IGNORE INTO Medico (nombre, apellido, matricula, email, id_especialidad, activo) VALUES (?, ?, ?, ?, ?, ?)", medicos)

        # --- 3. Poblar Pacientes ---
        # (Solo si la tabla está vacía)
        cursor.execute("SELECT COUNT(*) FROM Paciente")
        if cursor.fetchone()[0] < 15:
            print("Poblando pacientes y creando historiales...")
            pacientes = [
                # 4 existentes con DNI corregido
                ('Juan', 'Perez', '30123456', '1983-05-20', 'juan.perez@email.com', '351-111222', True),
                ('Maria', 'Gomez', '35456789', '1990-11-02', 'maria.gomez@email.com', '351-333444', True),
                ('Lucas', 'Torres', '40789123', '1998-02-14', 'lucas.torres@email.com', '351-555666', True),
                ('Sofia', 'Diaz', '38987654', '1995-07-30', 'sofia.diaz@email.com', '351-777888', True),
                # 11 nuevos
                ('Carlos', 'Ruiz', '28555666', '1980-01-15', 'carlos.ruiz@email.com', '351-222333', True),
                ('Laura', 'Fernandez', '33888999', '1988-08-25', 'laura.fernandez@email.com', '351-444555', True),
                ('Pedro', 'Gonzalez', '42111222', '2000-03-10', 'pedro.gonzalez@email.com', '351-666777', True),
                ('Ana', 'Martinez', '31444555', '1985-12-05', 'ana.martinez@email.com', '351-888999', True),
                ('Diego', 'Lopez', '29777888', '1982-06-20', 'diego.lopez@email.com', '351-101010', True),
                ('Valentina', 'Sanchez', '45333444', '2003-09-18', 'valentina.sanchez@email.com', '351-121212', True),
                ('Javier', 'Romero', '25666777', '1975-11-30', 'javier.romero@email.com', '351-131313', True),
                ('Camila', 'Alvarez', '41999000', '1999-04-22', 'camila.alvarez@email.com', '351-141414', True),
                ('Mateo', 'Torres', '43222111', '2001-07-12', 'mateo.torres@email.com', '351-151515', True),
                ('Isabella', 'Gutierrez', '36555444', '1992-10-01', 'isabella.gutierrez@email.com', '351-161616', True),
                ('Sebastian', 'Castro', '39888777', '1997-02-28', 'sebastian.castro@email.com', '351-171717', True)
            ]
            
            # Insertar todos los pacientes
            cursor.executemany("INSERT OR IGNORE INTO Paciente (nombre, apellido, dni, fecha_nacimiento, email, telefono, activo) VALUES (?, ?, ?, ?, ?, ?, ?)", pacientes)

        else:
            print("Pacientes ya existentes, omitiendo poblamiento.")


        # --- 4. Poblar Tipos de Consulta ---
        # Nota: Todas las consultas ahora tienen duración fija de 30 minutos
        tipos_consulta = [
            ('Consulta General', 'Consulta estándar de 30 minutos.', 30),
            ('Primera Vez', 'Primera consulta con el especialista.', 30),
            ('Control', 'Consulta de seguimiento o control.', 30),
            ('Urgencia', 'Consulta no programada por una urgencia.', 30)
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
            (1, 'NAC-1001', 'Paracetamol 500mg', 'Analgésico para fiebre y dolor.', 'Comprimido', 'Caja x 20 comprimidos'),
            (3, 'NAC-1002', 'Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo.', 'Comprimido recubierto', 'Caja x 10 comprimidos'),
            (2, 'NAC-2001', 'Amoxicilina 500mg', 'Antibiótico de amplio espectro.', 'Cápsula', 'Caja x 16 cápsulas')
        ]
        cursor.executemany("INSERT OR IGNORE INTO Medicamento (id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica, presentacion) VALUES (?, ?, ?, ?, ?, ?)", medicamentos)

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
            
            # --- Turnos fijos para el día de hoy (para pruebas) ---
            hoy = datetime.datetime.now()
            turnos_hoy = [
                # Paciente 1 (Juan Perez) con Médico 1 (Ana García) a las 10:00
                (1, 1, 1, 1, hoy.replace(hour=10, minute=0, second=0, microsecond=0).isoformat(), 
                 hoy.replace(hour=10, minute=30, second=0, microsecond=0).isoformat(), 'Programado'),
                
                # Paciente 2 (Maria Gomez) con Médico 2 (Carlos Lopez) a las 11:30
                (2, 2, 2, 2, hoy.replace(hour=11, minute=30, second=0, microsecond=0).isoformat(), 
                 hoy.replace(hour=12, minute=0, second=0, microsecond=0).isoformat(), 'Programado'),

                # Paciente 3 (Lucas Torres) con Médico 1 (Ana García) a las 12:00
                (3, 1, 1, 1, hoy.replace(hour=12, minute=0, second=0, microsecond=0).isoformat(), 
                 hoy.replace(hour=12, minute=30, second=0, microsecond=0).isoformat(), 'Programado')
            ]
            cursor.executemany(
                """INSERT INTO Turno 
                   (id_paciente, id_medico, id_especialidad, id_tipo_consulta, fecha_hora_inicio, fecha_hora_fin, estado) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                turnos_hoy
            )

            # DURACIÓN FIJA DE 30 MINUTOS para todos los turnos
            DURACION_FIJA = 30
            
            turnos_ejemplo = []
            for i in range(30):
                # Datos aleatorios
                id_paciente = random.randint(1, 4)
                id_medico = random.randint(1, 4)
                # Usar siempre tipo de consulta 1 (Consulta General - 30 minutos)
                id_tipo_consulta = 1
                
                # Fecha aleatoria en los últimos 6 meses o próximos 6 meses
                dias_aleatorios = random.randint(-180, 180)
                hora_aleatoria = random.randint(8, 17)
                minuto_aleatorio = random.choice([0, 30])  # Solo en punto o y media
                fecha_inicio = datetime.datetime.now() + datetime.timedelta(days=dias_aleatorios)
                fecha_inicio = fecha_inicio.replace(hour=hora_aleatoria, minute=minuto_aleatorio, second=0, microsecond=0)


                if(fecha_inicio < datetime.datetime.now()):
                    estado = random.choice(estados_turno)
                else:
                    estado = "Programado"
                
                # Duración fija de 30 minutos
                fecha_fin = fecha_inicio + datetime.timedelta(minutes=DURACION_FIJA)
                
                # Obtener especialidad del médico
                cursor.execute("SELECT id_especialidad FROM Medico WHERE id_medico = ?", (id_medico,))
                id_especialidad = cursor.fetchone()[0]
                
                turnos_ejemplo.append((id_paciente, id_medico, id_especialidad, id_tipo_consulta, fecha_inicio.isoformat(), fecha_fin.isoformat(), estado))
            
            cursor.executemany(
                """INSERT INTO Turno 
                   (id_paciente, id_medico, id_especialidad, id_tipo_consulta, fecha_hora_inicio, fecha_hora_fin, estado) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                turnos_ejemplo
            )

        # --- 9. Poblar Consultas de Ejemplo ---
        cursor.execute("SELECT COUNT(*) FROM Consulta")
        if cursor.fetchone()[0] == 0:
            print("Poblando consultas...")
            consultas_ejemplo = [
                # Consulta para el Turno 1 (Paciente Juan Perez)
                (1, 'Control anual cardiológico', 'Paciente refiere buen estado general. Se solicita electrocardiograma de control. Presión arterial 120/80. Sin soplos audibles. Próximo control en 1 año.'),
                # Consulta para el Turno 2 (Paciente Maria Gomez)
                (2, 'Revisión de lunar', 'Se observa nevo melanocítico en espalda, de características benignas. Se recomienda control en 6 meses y uso de protector solar.'),
                # Consulta para el Turno 3 (Paciente Lucas Torres)
                (3, 'Dolor de rodilla post-fútbol', 'Paciente con gonalgia en rodilla derecha tras actividad deportiva. Se indica reposo, hielo y se receta antiinflamatorio. Se solicita radiografía para descartar lesiones óseas.'),
                # Consulta para el Turno 4 (Paciente Sofia Diaz)
                (4, 'Control pediátrico general', 'Niña presenta buen desarrollo acorde a su edad. Calendario de vacunación completo. Se refuerzan pautas de alimentación saludable.'),
                # Consulta para el Turno 5 (Paciente Juan Perez)
                (5, 'Control cardiológico pasado', 'Resultados de ECG normales. Paciente asintomático. Se mantiene medicación actual.'),
                # Consulta para el Turno 6 (Paciente Juan Perez)
                (6, 'Consulta por erupción cutánea', 'Se diagnostica dermatitis de contacto en manos. Se receta crema con corticoides y se recomienda evitar alérgeno sospechoso (detergente).'),
                # Consulta para el Turno 7 (Paciente Lucas Torres) - Aún no tiene consulta, es un turno futuro.
                # Consulta para el Turno 8 (Paciente Maria Gomez)
                (8, 'Control de acné', 'Evolución favorable con tratamiento tópico. Se ajusta dosis y se programa nuevo control en 3 meses.'),
                # Consulta para el Turno 9 (Paciente Juan Perez)
                (9, 'Consulta por resfrío común', 'Cuadro viral autolimitado. Se indican medidas de soporte: reposo e hidratación. Sin complicaciones.'),
                # Consulta para el Turno 10 (Paciente Sofia Diaz) - Aún no tiene consulta, es un turno futuro.
                # Dos consultas adicionales para el paciente 1, para tener más historial
                (1, 'Chequeo de rutina', 'Paciente se presenta para chequeo general. Todo en orden.'),
                (5, 'Seguimiento de presión', 'La presión arterial se mantiene estable. Continuar con el mismo tratamiento.')
            ]
            cursor.executemany("INSERT INTO Consulta (id_turno, motivo_consulta, observaciones) VALUES (?, ?, ?)", consultas_ejemplo)

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
