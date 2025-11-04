from flask import Blueprint, jsonify, request
from dao import especialidad_dao

especialidades_bp = Blueprint('especialidades_routes', __name__, url_prefix='/especialidades')

@especialidades_bp.route('/', methods=['GET'])
def get_especialidades():
    especialidades = especialidad_dao.obtener_especialidades()
    return jsonify(especialidades)

@especialidades_bp.route('/', methods=['POST'])
def add_especialidad():
    data = request.get_json()
    nombre = data.get('nombre')
    descripcion = data.get('descripcion')
    
    if not nombre:
        return jsonify({"error": "El nombre es obligatorio"}), 400
        
    especialidad_dao.crear_especialidad(nombre, descripcion)
    return jsonify({"mensaje": "Especialidad creada exitosamente"}), 201

@especialidades_bp.route('/<int:id_especialidad>', methods=['GET', 'PUT', 'DELETE'])
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
        try:
            especialidad_dao.eliminar_especialidad(id_especialidad)
            return jsonify({"mensaje": "Especialidad eliminada exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 409
        except Exception as e:
            return jsonify({"error": f"Error al eliminar especialidad: {str(e)}"}), 500