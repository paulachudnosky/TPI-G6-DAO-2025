from flask import Blueprint, jsonify, request
from dao import medico_dao

# Creamos el Blueprint. 
# El primer argumento es el nombre del blueprint.
# El segundo es el nombre del módulo (__name__).
# url_prefix antepondrá '/medicos' a todas las rutas definidas en este blueprint.
medicos_bp = Blueprint('medicos_routes', __name__, url_prefix='/medicos')

@medicos_bp.route('/', methods=['GET'])
def get_medicos():
    """Obtiene todos los médicos con el nombre de su especialidad."""
    medicos = medico_dao.obtener_medicos()
    return jsonify(medicos)

@medicos_bp.route('/', methods=['POST'])
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

@medicos_bp.route('/<int:id_medico>', methods=['GET', 'PUT', 'DELETE'])
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
        try:
            medico_dao.eliminar_medico(id_medico)
            return jsonify({"mensaje": "Médico eliminado exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 409
        except Exception as e:
            return jsonify({"error": f"Error al eliminar médico: {str(e)}"}), 500