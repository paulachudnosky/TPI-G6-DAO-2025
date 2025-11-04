from flask import Blueprint, jsonify
from dao import tipo_consulta_dao

tipos_consulta_bp = Blueprint('tipos_consulta_routes', __name__, url_prefix='/tipos-consulta')

@tipos_consulta_bp.route('/', methods=['GET'])
def get_tipos_consulta():
    return jsonify(tipo_consulta_dao.obtener_tipos_consulta())