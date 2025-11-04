from flask import Blueprint, jsonify
from dao import medicamento_dao

medicamentos_bp = Blueprint('medicamentos_routes', __name__, url_prefix='/medicamentos')

@medicamentos_bp.route('/', methods=['GET'])
def get_medicamentos():
    return jsonify(medicamento_dao.obtener_medicamentos())