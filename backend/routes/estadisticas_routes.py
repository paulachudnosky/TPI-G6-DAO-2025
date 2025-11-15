from flask import Blueprint, jsonify, request
from dao import turno_dao

# El prefijo de la URL coincidirá con el BASE_URL del servicio del frontend
estadisticas_bp = Blueprint('estadisticas_routes', __name__, url_prefix='/turnos/estadisticas')

@estadisticas_bp.route('/por_especialidad', methods=['GET'])
def get_turnos_por_especialidad():
    """
    Endpoint para obtener la cantidad de turnos por especialidad.
    Acepta parámetros opcionales 'fecha_inicio' y 'fecha_fin'.
    Llama a la función: contar_turnos_por_especialidad(fecha_inicio, fecha_fin)
    """
    # Obtenemos los parámetros de la URL, si no existen serán None
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    try:
        resultado = turno_dao.contar_turnos_por_especialidad(fecha_inicio, fecha_fin)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500

@estadisticas_bp.route('/por_estado', methods=['GET'])
def get_turnos_por_estado():
    """
    Endpoint para contar turnos por estado (asistidos, no asistidos, ausentes).
    Acepta parámetros opcionales 'fecha_inicio' y 'fecha_fin'.
    Llama a la función: contar_turnos_por_estado(fecha_inicio, fecha_fin)
    """
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    try:
        resultado = turno_dao.contar_turnos_por_estado(fecha_inicio, fecha_fin)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500

@estadisticas_bp.route('/pacientes_atendidos', methods=['GET'])
def get_pacientes_atendidos():
    """
    Endpoint para contar pacientes únicos atendidos por especialidad en un período.
    Requiere 'fecha_inicio' y 'id_especialidad'. 'fecha_fin' es opcional.
    Llama a la función: contar_pacientes_atendidos_por_periodo(fecha_inicio, id_especialidad, fecha_fin)
    """
    fecha_inicio = request.args.get('fecha_inicio')
    id_especialidad = request.args.get('id_especialidad')
    fecha_fin = request.args.get('fecha_fin')

    if not fecha_inicio or not id_especialidad:
        return jsonify({"error": "Los parámetros 'fecha_inicio' y 'id_especialidad' son obligatorios"}), 400

    try:
        resultado = turno_dao.contar_pacientes_atendidos_por_periodo(fecha_inicio, id_especialidad, fecha_fin)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500

@estadisticas_bp.route('/por_medico_periodo', methods=['GET'])
def get_turnos_por_medico_periodo():
    """
    Endpoint para obtener un listado de turnos por médico en un período.
    Requiere 'fecha_inicio'. 'id_medico' y 'fecha_fin' son opcionales.
    Llama a la función: obtener_turnos_por_periodo(fecha_inicio, fecha_fin, id_medico)
    """
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    id_medico = request.args.get('id_medico')

    if not fecha_inicio:
        return jsonify({"error": "El parámetro 'fecha_inicio' es obligatorio"}), 400

    try:
        resultado = turno_dao.obtener_turnos_por_periodo(fecha_inicio, fecha_fin, id_medico)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500