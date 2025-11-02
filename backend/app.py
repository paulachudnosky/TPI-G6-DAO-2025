from flask import Flask, jsonify, request
from flask_cors import CORS
# Importamos todos los DAOs
from dao import (
    especialidad_dao, 
    paciente_dao, 
    medico_dao,
    historial_clinico_dao,
    tipo_consulta_dao,  
    tipo_medicamento_dao,
    medicamento_dao,
    horario_atencion_dao,
    turno_dao
)
# Importamos la función para crear la BD
from database import crear_base_de_datos_si_no_existe

app = Flask(__name__)
# Habilitar CORS para permitir llamadas desde el frontend en desarrollo
# Agrego el :5173 porque aparentemente a copilot le encanta confundirme el puerto 3000 por 5173
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}}) 

# --- RUTAS DE ESPECIALIDADES ---
@app.route('/especialidades', methods=['GET'])
def get_especialidades():
    especialidades = especialidad_dao.obtener_especialidades()
    return jsonify(especialidades)

@app.route('/especialidades', methods=['POST'])
def add_especialidad():
    data = request.get_json()
    nombre = data.get('nombre')
    descripcion = data.get('descripcion')
    
    if not nombre:
        return jsonify({"error": "El nombre es obligatorio"}), 400
        
    especialidad_dao.crear_especialidad(nombre, descripcion)
    return jsonify({"mensaje": "Especialidad creada exitosamente"}), 201

@app.route('/especialidades/<int:id_especialidad>', methods=['GET', 'PUT', 'DELETE'])
def handle_especialidad(id_especialidad):
    if request.method == 'GET':
        especialidad = especialidad_dao.obtener_especialidad_por_id(id_especialidad)
        if especialidad:
            return jsonify(especialidad)
        return jsonify({"error": "Especialidad no encontrada"}), 404

    elif request.method == 'PUT':
        data = request.get_json()
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')
        
        if not nombre:
            return jsonify({"error": "El nombre es obligatorio"}), 400
        
        especialidad_dao.actualizar_especialidad(id_especialidad, nombre, descripcion)
        return jsonify({"mensaje": "Especialidad actualizada exitosamente"})

    elif request.method == 'DELETE':
        especialidad_dao.eliminar_especialidad(id_especialidad)
        return jsonify({"mensaje": "Especialidad eliminada exitosamente"})

# --- RUTAS DE PACIENTES ---
@app.route('/pacientes', methods=['GET'])
def get_pacientes():
    pacientes = paciente_dao.obtener_pacientes()
    return jsonify(pacientes)

@app.route('/pacientes', methods=['POST'])
def add_paciente():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    dni = data.get('dni')
    
    if not nombre or not apellido or not dni:
        return jsonify({"error": "Nombre, apellido y DNI son obligatorios"}), 400
        
    paciente_dao.crear_paciente(
        nombre,
        apellido,
        dni,
        data.get('fecha_nacimiento'),
        data.get('email'),
        data.get('telefono')
    )
    return jsonify({"mensaje": "Paciente y su historial creados exitosamente"}), 201

@app.route('/pacientes/<int:id_paciente>', methods=['GET', 'PUT', 'DELETE'])
def handle_paciente(id_paciente):
    if request.method == 'GET':
        paciente = paciente_dao.obtener_paciente_por_id(id_paciente)
        if paciente:
            return jsonify(paciente)
        return jsonify({"error": "Paciente no encontrado"}), 404

    elif request.method == 'PUT':
        data = request.get_json()
        if not data.get('nombre') or not data.get('apellido') or not data.get('dni'):
            return jsonify({"error": "Nombre, apellido y DNI son obligatorios"}), 400
            
        paciente_dao.actualizar_paciente(
            id_paciente,
            data.get('nombre'),
            data.get('apellido'),
            data.get('dni'),
            data.get('fecha_nacimiento'),
            data.get('email'),
            data.get('telefono')
        )
        return jsonify({"mensaje": "Paciente actualizado exitosamente"})

    elif request.method == 'DELETE':
        paciente_dao.eliminar_paciente(id_paciente)
        return jsonify({"mensaje": "Paciente y su historial eliminados exitosamente"})

# --- RUTAS DE MÉDICOS ---
@app.route('/medicos', methods=['GET'])
def get_medicos():
    """Obtiene todos los médicos con el nombre de su especialidad."""
    medicos = medico_dao.obtener_medicos()
    return jsonify(medicos)

@app.route('/medicos', methods=['POST'])
def add_medico():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    matricula = data.get('matricula')
    email = data.get('email')
    id_especialidad = data.get('id_especialidad')
    
    if not nombre or not apellido or not matricula or not id_especialidad:
        return jsonify({"error": "Nombre, apellido, matrícula y especialidad son obligatorios"}), 400
        
    medico_dao.crear_medico(
        nombre,
        apellido,
        matricula,
        email,
        id_especialidad
    )
    return jsonify({"mensaje": "Médico creado exitosamente"}), 201

@app.route('/medicos/<int:id_medico>', methods=['GET', 'PUT', 'DELETE'])
def handle_medico(id_medico):
    if request.method == 'GET':
        medico = medico_dao.obtener_medico_por_id(id_medico)
        if medico:
            return jsonify(medico)
        return jsonify({"error": "Médico no encontrado"}), 404

    elif request.method == 'PUT':
        data = request.get_json()
        if not data.get('nombre') or not data.get('apellido') or not data.get('matricula') or not data.get('id_especialidad'):
            return jsonify({"error": "Nombre, apellido, matrícula y especialidad son obligatorios"}), 400

        medico_dao.actualizar_medico(
            id_medico,
            data.get('nombre'),
            data.get('apellido'),
            data.get('matricula'),
            data.get('email'),
            data.get('id_especialidad')
        )
        return jsonify({"mensaje": "Médico actualizado exitosamente"})

    elif request.method == 'DELETE':
        medico_dao.eliminar_medico(id_medico)
        return jsonify({"mensaje": "Médico eliminado exitosamente"})

# --- RUTAS DE HISTORIAL CLÍNICO ---
@app.route('/historial-clinico', methods=['GET'])
def get_historiales():
    historiales = historial_clinico_dao.obtener_historiales()
    return jsonify(historiales)

@app.route('/historial-clinico/<int:id_historial>', methods=['GET', 'PUT'])
def handle_historial(id_historial):
    if request.method == 'GET':
        historial = historial_clinico_dao.obtener_historial_por_id(id_historial)
        if historial:
            return jsonify(historial)
        return jsonify({"error": "Historial no encontrado"}), 404
    
    elif request.method == 'PUT':
        data = request.get_json()
        historial_clinico_dao.actualizar_historial(
            id_historial,
            data.get('grupo_sanguineo'),
            data.get('estado')
        )
        return jsonify({"mensaje": "Historial actualizado exitosamente"})

@app.route('/historial-clinico/paciente/<int:id_paciente>', methods=['GET'])
def get_historial_por_paciente(id_paciente):
    historial = historial_clinico_dao.obtener_historial_por_id_paciente(id_paciente)
    if historial:
        return jsonify(historial)
    return jsonify({"error": "No se encontró historial para el paciente"}), 404

# --- RUTAS DE TIPO CONSULTA ---
@app.route('/tipos-consulta', methods=['GET'])
def get_tipos_consulta():
    tipos = tipo_consulta_dao.obtener_tipos_consulta()
    return jsonify(tipos)

# --- RUTAS DE MEDICAMENTO Y TIPO MEDICAMENTO ---
@app.route('/tipos-medicamento', methods=['GET'])
def get_tipos_medicamento():
    tipos = tipo_medicamento_dao.obtener_tipos_medicamento()
    return jsonify(tipos)

@app.route('/medicamentos', methods=['GET'])
def get_medicamentos():
    medicamentos = medicamento_dao.obtener_medicamentos()
    return jsonify(medicamentos)

# --- RUTAS DE HORARIO ATENCIÓN ---
@app.route('/horarios-medico/<int:id_medico>', methods=['GET'])
def get_horarios_por_medico(id_medico):
    horarios = horario_atencion_dao.obtener_horarios_por_medico(id_medico)
    if horarios:
        return jsonify(horarios)
    return jsonify({"error": "No se encontraron horarios para el médico"}), 404

# --- RUTAS DE TURNOS ---
@app.route('/turnos', methods=['GET'])
def get_turnos():
    """Obtiene todos los turnos."""
    turnos = turno_dao.obtener_turnos()
    return jsonify(turnos)

@app.route('/turnos/medico/<int:id_medico>', methods=['GET'])
def get_turnos_por_medico(id_medico):
    """Obtiene todos los turnos de un médico."""
    turnos = turno_dao.obtener_turnos_por_medico(id_medico)
    return jsonify(turnos)

@app.route('/turnos', methods=['POST'])
def add_turno():
    """Crea un nuevo turno con validación de disponibilidad."""
    data = request.get_json()
    
    id_paciente = data.get('id_paciente')
    id_medico = data.get('id_medico')
    id_tipo_consulta = data.get('id_tipo_consulta')
    fecha_hora_inicio = data.get('fecha_hora_inicio') # Formato "AAAA-MM-DD HH:MM:SS"
    id_especialidad = data.get('id_especialidad') # Opcional
    
    if not all([id_paciente, id_medico, id_tipo_consulta, fecha_hora_inicio]):
        return jsonify({"error": "Faltan datos obligatorios (paciente, medico, tipo_consulta, fecha_hora_inicio)"}), 400
    
    # La lógica de validación y creación está en el DAO
    exito, mensaje = turno_dao.crear_turno(
        id_paciente,
        id_medico,
        id_tipo_consulta,
        fecha_hora_inicio,
        id_especialidad
    )
    
    if exito:
        return jsonify({"mensaje": mensaje}), 201
    else:
        # Si no es exitoso, el mensaje contiene el error (ej: "Horario no disponible")
        return jsonify({"error": mensaje}), 409 # 409 Conflict

@app.route('/turnos/<int:id_turno>/estado', methods=['PUT'])
def update_turno_estado(id_turno):
    """Actualiza el estado de un turno (ej: Cancelado, Realizado)."""
    data = request.get_json()
    nuevo_estado = data.get('estado')
    
    if not nuevo_estado:
        return jsonify({"error": "El campo 'estado' es obligatorio"}), 400
        
    exito, mensaje = turno_dao.actualizar_estado_turno(id_turno, nuevo_estado)
    
    if exito:
        return jsonify({"mensaje": mensaje})
    else:
        return jsonify({"error": mensaje}), 404

@app.route('/turnos/<int:id_turno>', methods=['DELETE'])
def delete_turno(id_turno):
    """Elimina un turno."""
    exito, mensaje = turno_dao.eliminar_turno(id_turno)
    
    if exito:
        return jsonify({"mensaje": mensaje})
    else:
        return jsonify({"error": mensaje}), 404


if __name__ == '__main__':
    crear_base_de_datos_si_no_existe()
    app.run(debug=True)