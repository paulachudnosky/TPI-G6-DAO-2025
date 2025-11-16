from flask import Blueprint, jsonify, request
from dao import especialidad_dao

especialidades_bp = Blueprint('especialidades_routes', __name__, url_prefix='/especialidades')

@especialidades_bp.route('/', methods=['GET'])
def get_especialidades():
    """Obtiene todas las especialidades, con opción de incluir inactivas."""
    incluir_inactivos = request.args.get('incluir_inactivos', 'false').lower() == 'true'
    especialidades = especialidad_dao.obtener_especialidades(incluir_inactivos=incluir_inactivos)
    return jsonify(especialidades)

@especialidades_bp.route('/', methods=['POST'])
def create_especialidad():
    """Crea una nueva especialidad."""
    data = request.get_json()
    nombre = data.get('nombre')
    
    if not nombre:
        return jsonify({"error": "El nombre es obligatorio"}), 400
        
    try:
        nueva_especialidad = especialidad_dao.crear_especialidad(
            nombre,
            data.get('descripcion'),
            data.get('activo', True)
        )
        return jsonify(nueva_especialidad), 201
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

@especialidades_bp.route('/<int:id_especialidad>', methods=['GET', 'PUT', 'DELETE'])
def handle_especialidad(id_especialidad):
    """Obtiene, actualiza o realiza la baja lógica de una especialidad."""
    if request.method == 'GET':
        especialidad = especialidad_dao.obtener_especialidad_por_id(id_especialidad)
        if especialidad:
            return jsonify(especialidad)
        return jsonify({"error": "Especialidad no encontrada"}), 404

    if request.method == 'PUT':
        return update_especialidad(id_especialidad)

    if request.method == 'DELETE':
        return delete_especialidad(id_especialidad)

def update_especialidad(id_especialidad):
    """Actualiza una especialidad existente."""
    data = request.get_json()
    if not data.get('nombre'):
        return jsonify({"error": "El nombre es obligatorio"}), 400
    
    activo = data.get('activo', True)
    try:
        actualizada = especialidad_dao.actualizar_especialidad(id_especialidad, data.get('nombre'), data.get('descripcion'), activo)
        if actualizada:
            return jsonify(actualizada), 200
        return jsonify({"error": "Especialidad no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

def delete_especialidad(id_especialidad):
    """Realiza la baja lógica de una especialidad."""
    try:
        if especialidad_dao.eliminar_especialidad(id_especialidad):
            return jsonify({"mensaje": "Especialidad desactivada exitosamente"}), 200
        return jsonify({"error": "Especialidad no encontrada"}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500