from flask import Blueprint, jsonify, request
from dao import horario_atencion_dao
from flask_cors import cross_origin 

horarios_bp = Blueprint('horarios_routes', __name__, url_prefix='/horarios')

@horarios_bp.route('/medico/<int:id_medico>', methods=['GET'])
def get_horarios_por_medico(id_medico):
    horarios = horario_atencion_dao.obtener_horarios_por_medico(id_medico)
    if horarios:
        return jsonify(horarios)
    return jsonify({"error": "No se encontraron horarios para el médico"}), 404

@horarios_bp.route('/<int:id_horario>', methods=['GET'])
@cross_origin()
def get_horario_by_id(id_horario):
    horario = horario_atencion_dao.obtener_horario_por_id(id_horario)
    if horario:
        return jsonify(horario)
    return jsonify({"error": "Horario no encontrado"}), 404

@horarios_bp.route('/', methods=['POST'])
def add_horario():
    """Crea un nuevo horario de atención."""
    data = request.get_json()
    id_medico = data.get('id_medico')
    dia_semana = data.get('dia_semana')
    hora_inicio = data.get('hora_inicio')
    hora_fin = data.get('hora_fin')

    if not all([id_medico, dia_semana, hora_inicio, hora_fin]):
        return jsonify({"error": "Faltan datos obligatorios (id_medico, dia_semana, hora_inicio, hora_fin)"}), 400
    
    nuevo_horario = horario_atencion_dao.crear_horario(id_medico, dia_semana, hora_inicio, hora_fin)
    
    if isinstance(nuevo_horario, dict) and 'error' in nuevo_horario:
        return jsonify(nuevo_horario), 409 # 409 Conflict

    return jsonify(nuevo_horario), 201

@horarios_bp.route('/<int:id_horario>', methods=['PUT'])
def update_horario(id_horario):
    """Actualiza un horario de atención existente."""
    data = request.get_json()
    id_medico = data.get('id_medico')
    dia_semana = data.get('dia_semana')
    hora_inicio = data.get('hora_inicio')
    hora_fin = data.get('hora_fin')

    if not all([id_medico, dia_semana, hora_inicio, hora_fin]):
        return jsonify({"error": "Faltan datos obligatorios (id_medico, dia_semana, hora_inicio, hora_fin)"}), 400

    horario_actualizado = horario_atencion_dao.actualizar_horario(id_horario, id_medico, dia_semana, hora_inicio, hora_fin)
    
    if isinstance(horario_actualizado, dict) and 'error' in horario_actualizado:
        return jsonify(horario_actualizado), 409 # 409 Conflict

    if horario_actualizado:
        return jsonify(horario_actualizado)
    return jsonify({"error": "Horario no encontrado"}), 404

@horarios_bp.route('/<int:id_horario>', methods=['DELETE'])
def delete_horario(id_horario):
    """Elimina un horario de atención."""
    exito = horario_atencion_dao.eliminar_horario(id_horario)
    if exito:
        return jsonify({"mensaje": "Horario eliminado exitosamente"})
    return jsonify({"error": "Horario no encontrado o no se pudo eliminar"}), 404