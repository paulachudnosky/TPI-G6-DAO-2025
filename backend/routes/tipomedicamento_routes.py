from flask import Blueprint, jsonify
from dao import tipo_medicamento_dao

tipos_medicamento_bp = Blueprint('tipos_medicamento_routes', __name__, url_prefix='/tipos-medicamento')

@tipos_medicamento_bp.route('/', methods=['GET'])
def get_tipos_medicamento():
    return jsonify(tipo_medicamento_dao.obtener_tipos_medicamento())