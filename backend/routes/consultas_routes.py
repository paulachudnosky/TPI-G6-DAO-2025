from flask import Blueprint, jsonify, request
from dao import consultas_dao

consultas_bp = Blueprint('consultas_routes', __name__, url_prefix='/consultas')

@consultas_bp.route('/', methods=['GET'])
def get_consultas():
    """Obtiene todas las consultas."""
    try:
        consultas = consultas_dao.obtener_consultas()
        return jsonify(consultas)
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

@consultas_bp.route('/<int:id_consulta>', methods=['GET'])
def get_consulta(id_consulta):
    """Obtiene una consulta por su ID."""
    try:
        consulta = consultas_dao.obtener_consulta_por_id(id_consulta)
        if consulta:
            return jsonify(consulta)
        return jsonify({"error": "Consulta no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

@consultas_bp.route('/paciente/<int:id_paciente>', methods=['GET'])
def get_consultas_por_paciente(id_paciente):
    """Obtiene todas las consultas de un paciente específico."""
    try:
        consultas = consultas_dao.obtener_consultas_por_paciente(id_paciente)
        return jsonify(consultas)
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500


@consultas_bp.route('/', methods=['POST'])
def add_consulta():
    """Crea una nueva consulta."""
    data = request.get_json()
    id_turno = data.get('id_turno')
    motivo_consulta = data.get('motivo_consulta')
    observaciones = data.get('observaciones')

    if not id_turno:
        return jsonify({"error": "El ID del turno es obligatorio"}), 400
    
    try:
        nueva_consulta = consultas_dao.crear_consulta(id_turno, motivo_consulta, observaciones)
        return jsonify(nueva_consulta), 201
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

@consultas_bp.route('/<int:id_consulta>', methods=['PUT'])
def update_consulta(id_consulta):
    """Actualiza una consulta existente."""
    data = request.get_json()
    try:
        consulta_actualizada = consultas_dao.actualizar_consulta(id_consulta, data.get('motivo_consulta'), data.get('observaciones'))
        return jsonify(consulta_actualizada)
    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500