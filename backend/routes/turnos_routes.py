from flask import Blueprint, jsonify, request
from dao import turno_dao

turnos_bp = Blueprint('turnos_routes', __name__, url_prefix='/turnos')

@turnos_bp.route('/', methods=['GET'])
def get_turnos():
    """Obtiene todos los turnos."""
    turnos = turno_dao.obtener_turnos()
    return jsonify(turnos)

@turnos_bp.route('/medico/<int:id_medico>', methods=['GET'])
def get_turnos_por_medico(id_medico):
    """Obtiene todos los turnos de un médico."""
    turnos = turno_dao.obtener_turnos_por_medico(id_medico)
    return jsonify(turnos)

@turnos_bp.route('/medico/<int:id_medico>/dia', methods=['GET'])
def get_turnos_por_medico_y_dia(id_medico):
    """
    Obtiene los turnos de un médico para un día específico.
    Ej: /turnos/medico/1/dia?fecha=2024-10-25
    """
    fecha = request.args.get('fecha')
    if not fecha:
        return jsonify({"error": "El parámetro 'fecha' (YYYY-MM-DD) es obligatorio"}), 400
    
    turnos = turno_dao.obtener_turnos_por_dia_y_medico(id_medico, fecha)
    return jsonify(turnos)

@turnos_bp.route('/dia/<string:fecha>', methods=['GET'])
def get_turnos_por_dia(fecha):
    """
    Obtiene todos los turnos para un día específico, para todos los médicos.
    Ej: /turnos/dia/2024-11-15
    """
    try:
        turnos = turno_dao.obtener_turnos_por_dia(fecha)
        return jsonify(turnos)
    except Exception as e:
        # Manejo de errores genérico para proteger el servidor
        return jsonify({"error": f"Error al obtener los turnos del día: {str(e)}"}), 500

@turnos_bp.route('/', methods=['POST'])
def add_turno():
    """Crea un nuevo turno con validación de disponibilidad."""
    data = request.get_json()
    
    id_paciente = data.get('id_paciente')
    id_medico = data.get('id_medico')
    id_tipo_consulta = data.get('id_tipo_consulta')
    fecha_hora_inicio = data.get('fecha_hora_inicio')
    id_especialidad = data.get('id_especialidad')
    
    if not all([id_paciente, id_medico, id_tipo_consulta, fecha_hora_inicio]):
        return jsonify({"error": "Faltan datos obligatorios (paciente, medico, tipo_consulta, fecha_hora_inicio)"}), 400
    
    exito, mensaje = turno_dao.crear_turno(
        id_paciente, id_medico, id_tipo_consulta, fecha_hora_inicio, id_especialidad
    )
    
    if exito:
        return jsonify({"mensaje": mensaje}), 201
    else:
        return jsonify({"error": mensaje}), 409

@turnos_bp.route('/<int:id_turno>/estado', methods=['PUT'])
def update_turno_estado(id_turno):
    """Actualiza el estado de un turno."""
    data = request.get_json()
    nuevo_estado = data.get('estado')
    
    if not nuevo_estado:
        return jsonify({"error": "El campo 'estado' es obligatorio"}), 400
        
    exito, mensaje = turno_dao.actualizar_estado_turno(id_turno, nuevo_estado)
    
    if exito:
        return jsonify({"mensaje": mensaje})
    else:
        return jsonify({"error": mensaje}), 404

@turnos_bp.route('/<int:id_turno>', methods=['DELETE'])
def delete_turno(id_turno):
    """Elimina un turno."""
    exito, mensaje = turno_dao.eliminar_turno(id_turno)
    
    if exito:
        return jsonify({"mensaje": mensaje})
    else:
        return jsonify({"error": mensaje}), 404