from flask import Blueprint, jsonify, request
from dao import historial_clinico_dao

historial_clinico_bp = Blueprint('historial_clinico_routes', __name__, url_prefix='/historial-clinico')

@historial_clinico_bp.route('/', methods=['GET'])
def get_historiales():
    historiales = historial_clinico_dao.obtener_historiales()
    return jsonify(historiales)

@historial_clinico_bp.route('/<int:id_historial>', methods=['GET', 'PUT'])
def handle_historial(id_historial):
    if request.method == 'GET':
        historial = historial_clinico_dao.obtener_historial_por_id(id_historial)
        if historial:
            return jsonify(historial)
        return jsonify({"error": "Historial no encontrado"}), 404
    elif request.method == 'PUT':
        data = request.get_json()
        historial_clinico_dao.actualizar_historial(id_historial, data.get('grupo_sanguineo'), data.get('estado'))
        return jsonify({"mensaje": "Historial actualizado exitosamente"})

@historial_clinico_bp.route('/paciente/<int:id_paciente>', methods=['GET'])
def get_historial_por_paciente(id_paciente):
    historial = historial_clinico_dao.obtener_historial_por_id_paciente(id_paciente)
    if historial:
        return jsonify(historial)
    return jsonify({"error": "No se encontró historial para el paciente"}), 404