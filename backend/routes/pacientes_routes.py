from flask import Blueprint, jsonify, request
from dao import paciente_dao

pacientes_bp = Blueprint('pacientes_routes', __name__, url_prefix='/pacientes')

@pacientes_bp.route('/', methods=['GET'])
def get_pacientes():
    """Obtiene todos los pacientes."""
    pacientes = paciente_dao.obtener_pacientes()
    return jsonify(pacientes)

@pacientes_bp.route('', methods=['POST'])
def create_paciente():
    """Crea un nuevo paciente."""
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    dni = data.get('dni')
    
    if not nombre or not apellido or not dni:
        return jsonify({"error": "Nombre, apellido y DNI son obligatorios"}), 400
        
    try:
        nuevo_paciente = paciente_dao.crear_paciente(
            nombre,
            apellido,
            dni,
            data.get('fecha_nacimiento'),
            data.get('email'),
            data.get('telefono')
        )
        return jsonify(nuevo_paciente), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 409 # Por si el DNI o email ya existen
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

@pacientes_bp.route('/<int:id_paciente>', methods=['GET', 'PUT', 'DELETE'])
def handle_paciente(id_paciente):
    """Obtiene, actualiza o elimina un paciente por su ID."""
    paciente = paciente_dao.obtener_paciente_por_id(id_paciente)
    if not paciente:
        return jsonify({"error": "Paciente no encontrado"}), 404

    if request.method == 'GET':
        return jsonify(paciente)

    if request.method == 'PUT':
        return update_paciente(id_paciente)

    if request.method == 'DELETE':
        return delete_paciente(id_paciente)

def update_paciente(id_paciente):
    """Actualiza un paciente existente."""
    data = request.get_json()
    if not data.get('nombre') or not data.get('apellido') or not data.get('dni'):
        return jsonify({"error": "Nombre, apellido y DNI son obligatorios"}), 400
        
    try:
        paciente_actualizado = paciente_dao.actualizar_paciente(
            id_paciente, data.get('nombre'), data.get('apellido'), data.get('dni'),
            data.get('fecha_nacimiento'), data.get('email'), data.get('telefono')
        )
        return jsonify(paciente_actualizado), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

def delete_paciente(id_paciente):
    """Elimina un paciente."""
    try:
        paciente_dao.eliminar_paciente(id_paciente)
        return jsonify({"mensaje": "Paciente y su historial eliminados exitosamente"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 409
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500