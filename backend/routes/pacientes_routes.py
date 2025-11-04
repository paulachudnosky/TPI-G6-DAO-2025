from flask import Blueprint, jsonify, request
from dao import paciente_dao

pacientes_bp = Blueprint('pacientes_routes', __name__, url_prefix='/pacientes')

@pacientes_bp.route('/', methods=['GET'])
def get_pacientes():
    pacientes = paciente_dao.obtener_pacientes()
    return jsonify(pacientes)

@pacientes_bp.route('/', methods=['POST'])
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

@pacientes_bp.route('/<int:id_paciente>', methods=['GET', 'PUT', 'DELETE'])
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