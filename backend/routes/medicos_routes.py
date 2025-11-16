from flask import Blueprint, jsonify, request
from dao import medico_dao

# Creamos el Blueprint. 
# El primer argumento es el nombre del blueprint.
# El segundo es el nombre del módulo (__name__).
# url_prefix antepondrá '/medicos' a todas las rutas definidas en este blueprint.
medicos_bp = Blueprint('medicos_routes', __name__, url_prefix='/medicos')

@medicos_bp.route('/', methods=['GET'])
def get_medicos():
    """Obtiene todos los médicos con el nombre de su especialidad."""
    # Verificamos si se está pidiendo solo los médicos activos
    activo_param = request.args.get('activo')
    if activo_param and activo_param.lower() == 'true':
        medicos = medico_dao.obtener_medicos_activos()
        return jsonify(medicos)
    else:
        medicos = medico_dao.obtener_medicos()
        return jsonify(medicos)

@medicos_bp.route('/', methods=['POST'])
def add_medico():
    data = request.get_json()
    nombre = data.get('nombre')
    apellido = data.get('apellido')
    matricula = data.get('matricula')
    email = data.get('email')
    id_especialidad = data.get('id_especialidad')
    activo = data.get('activo', True) # Por defecto, se crea como activo
    
    if not nombre or not apellido or not matricula or not id_especialidad:
        return jsonify({"error": "Nombre, apellido, matrícula y especialidad son obligatorios"}), 400
        
    medico_dao.crear_medico(
        nombre,
        apellido,
        matricula,
        email,
        id_especialidad,
        activo
    )
    return jsonify({"mensaje": "Médico creado exitosamente"}), 201

@medicos_bp.route('/<int:id_medico>', methods=['PATCH'])
def set_medico_status(id_medico):
    """Endpoint para la baja/alta lógica (soft delete)."""
    data = request.get_json()
    if 'activo' not in data:
        return jsonify({"error": "El campo 'activo' es obligatorio"}), 400
    
    try:
        activo = bool(data['activo'])
        medico_dao.actualizar_estado_medico(id_medico, activo)
        return jsonify({"mensaje": f"Estado del médico actualizado a {'activo' if activo else 'inactivo'}"})
    except Exception as e:
        return jsonify({"error": f"Error al actualizar estado del médico: {str(e)}"}), 500

@medicos_bp.route('/<int:id_medico>', methods=['GET', 'PUT'])
def handle_medico(id_medico):
    if request.method == 'GET':
        medico = medico_dao.obtener_medico_por_id(id_medico)
        if medico:
            return jsonify(medico)
        return jsonify({"error": "Médico no encontrado"}), 404

    elif request.method == 'PUT':
        data = request.get_json()
        if not data.get('nombre') or not data.get('apellido') or not data.get('matricula') or not data.get('id_especialidad'):
            return jsonify({"error": "Nombre, apellido, matrícula y especialidad son obligatorios"}), 400
        activo = data.get('activo', True)

        medico_dao.actualizar_medico(
            id_medico,
            data.get('nombre'),
            data.get('apellido'),
            data.get('matricula'),
            data.get('email'),
            data.get('id_especialidad'),
            activo
        )
        return jsonify({"mensaje": "Médico actualizado exitosamente"})