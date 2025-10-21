from flask import Flask, jsonify, request
from dao import especialidad_dao, paciente_dao, medico_dao 

app = Flask(__name__)

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

# Ruta para obtener, actualizar y eliminar una especialidad específica
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
    return jsonify({"mensaje": "Paciente creado exitosamente"}), 201

# Ruta para obtener, actualizar y eliminar un paciente específico
@app.route('/pacientes/<int:id_paciente>', methods=['GET', 'PUT', 'DELETE'])
def handle_paciente(id_paciente):
    if request.method == 'GET':
        paciente = paciente_dao.obtener_paciente_por_id(id_paciente)
        if paciente:
            return jsonify(paciente)
        return jsonify({"error": "Paciente no encontrado"}), 404

    elif request.method == 'PUT':
        data = request.get_json()
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
        return jsonify({"mensaje": "Paciente eliminado exitosamente"})

# --- RUTAS DE MÉDICOS ---
@app.route('/medicos', methods=['GET'])
def get_medicos():
    medicos = medico_dao.obtener_medicos()
    return jsonify(medicos)

@app.route('/medicos', methods=['POST'])
def add_medico():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    matricula = data.get('matricula')
    
    if not nombre or not apellido or not matricula:
        return jsonify({"error": "Nombre, apellido y matrícula son obligatorios"}), 400
        
    medico_dao.crear_medico(
        nombre,
        apellido,
        matricula,
        data.get('email')
    )
    return jsonify({"mensaje": "Médico creado exitosamente"}), 201

# Ruta para obtener, actualizar y eliminar un médico específico
@app.route('/medicos/<int:id_medico>', methods=['GET', 'PUT', 'DELETE'])
def handle_medico(id_medico):
    if request.method == 'GET':
        medico = medico_dao.obtener_medico_por_id(id_medico)
        if medico:
            return jsonify(medico)
        return jsonify({"error": "Médico no encontrado"}), 404

    elif request.method == 'PUT':
        data = request.get_json()
        medico_dao.actualizar_medico(
            id_medico,
            data.get('nombre'),
            data.get('apellido'),
            data.get('matricula'),
            data.get('email')
        )
        return jsonify({"mensaje": "Médico actualizado exitosamente"})

    elif request.method == 'DELETE':
        medico_dao.eliminar_medico(id_medico)
        return jsonify({"mensaje": "Médico eliminado exitosamente"})


if __name__ == '__main__':
    from database import crear_base_de_datos
    crear_base_de_datos()
    app.run(debug=True)