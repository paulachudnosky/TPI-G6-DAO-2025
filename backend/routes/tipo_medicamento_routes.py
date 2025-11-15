from flask import Blueprint, jsonify
from dao import tipo_medicamento_dao
import sqlite3

tipos_medicamento_bp = Blueprint('tipos_medicamento_routes', __name__, url_prefix='/tipos_medicamento')

@tipos_medicamento_bp.route('/', methods=['GET'])
def get_tipos_medicamento():
    """Obtiene todos los tipos de medicamento."""
    try:
        tipos = tipo_medicamento_dao.obtener_tipos_medicamento()
        return jsonify(tipos)
    except Exception as e:
        print(f"Error en GET /tipos-medicamento: {e}")
        return jsonify({"error": f"Error al obtener tipos de medicamento: {str(e)}"}), 500