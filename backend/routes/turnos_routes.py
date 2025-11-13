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
        missing = []
        if not id_paciente: missing.append('id_paciente')
        if not id_medico: missing.append('id_medico')
        if not id_tipo_consulta: missing.append('id_tipo_consulta')
        if not fecha_hora_inicio: missing.append('fecha_hora_inicio')
        error_msg = f"Faltan datos obligatorios: {', '.join(missing)}"
        return jsonify({"error": error_msg}), 400
    
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


@turnos_bp.route('/<int:id_turno>', methods=['GET'])
def get_turno(id_turno):
    """Obtiene un turno específico por su ID con información completa."""
    turno = turno_dao.obtener_turno_por_id(id_turno)
    
    if turno:
        return jsonify(turno)
    else:
        return jsonify({"error": "Turno no encontrado"}), 404

@turnos_bp.route('/calendario', methods=['GET'])
def get_turnos_calendario():
    """
    Obtiene un resumen de turnos por día para un mes específico.
    Ej: /turnos/calendario?anio=2025&mes=11
    """
    anio = request.args.get('anio', type=int)
    mes = request.args.get('mes', type=int)
    
    if not anio or not mes:
        return jsonify({"error": "Los parámetros 'anio' y 'mes' son obligatorios"}), 400
    
    if mes < 1 or mes > 12:
        return jsonify({"error": "El mes debe estar entre 1 y 12"}), 400
    
    resumen = turno_dao.obtener_turnos_mes_resumen(anio, mes)
    return jsonify(resumen)


@turnos_bp.route('/<int:id_turno>', methods=['PUT'])
def update_turno(id_turno):
    """
    Actualiza un turno completo con re-validación de disponibilidad.
    Campos permitidos: id_medico, fecha_hora_inicio, id_tipo_consulta, id_especialidad
    """
    data = request.get_json()
    
    exito, mensaje = turno_dao.actualizar_turno(id_turno, data)
    
    if exito:
        return jsonify({"mensaje": mensaje})
    else:
        return jsonify({"error": mensaje}), 400


@turnos_bp.route('/<int:id_turno>/validar-dia-actual', methods=['GET'])
def validar_turno_dia_actual(id_turno):
    """
    Valida si un turno corresponde al día actual.
    Útil antes de crear una consulta.
    """
    es_hoy, fecha_turno = turno_dao.validar_turno_dia_actual(id_turno)
    
    if fecha_turno is None:
        return jsonify({"error": "Turno no encontrado"}), 404
    
    return jsonify({
        "es_dia_actual": es_hoy,
        "fecha_turno": fecha_turno
    })

@turnos_bp.route('/turnos/actualizar-vencidos', methods=['POST'])
def actualizar_vencidos():
    try:
        cantidad_actualizada, mensaje = turno_dao.actualizar_turnos_vencidos()
        return jsonify({'mensaje': mensaje, 'cantidad_actualizada': cantidad_actualizada}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@turnos_bp.route('/turnos/vencidos', methods=['GET'])
def obtener_vencidos():
    try:
        turnos_vencidos = turno_dao.obtener_turnos_vencidos()
        return jsonify(turnos_vencidos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
