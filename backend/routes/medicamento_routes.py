from flask import Blueprint, jsonify, request
from dao import medicamento_dao
import sqlite3 # Importamos sqlite3 para capturar sus errores

medicamentos_bp = Blueprint('medicamentos_routes', __name__, url_prefix='/medicamentos')

@medicamentos_bp.route('/', methods=['GET'])
def get_medicamentos():
    """Obtiene todos los medicamentos."""
    return jsonify(medicamento_dao.obtener_medicamentos())

# --- RUTA 'CREAR' (AHORA CON MANEJO DE ERRORES) ---
@medicamentos_bp.route('/', methods=['POST'])
def add_medicamento():
    """Crea un nuevo medicamento."""
    data = request.get_json()
    
    try:
        id_tipo_medicamento = data.get('id_tipo_medicamento')
        codigo_nacional = data.get('codigo_nacional')
        nombre = data.get('nombre')
        descripcion = data.get('descripcion')
        forma_farmaceutica = data.get('forma_farmaceutica')
        presentacion = data.get('presentacion')
        
        if not nombre or not codigo_nacional or not id_tipo_medicamento:
            return jsonify({"error": "Nombre, Código Nacional y Tipo son obligatorios"}), 400
            
        # Intentamos convertir el ID a entero, por si el formulario lo manda como string
        id_tipo_int = int(id_tipo_medicamento)

        medicamento_dao.crear_medicamento(
            id_tipo_int, 
            codigo_nacional, 
            nombre, 
            descripcion, 
            forma_farmaceutica, 
            presentacion
        )
        return jsonify({"mensaje": "Medicamento creado exitosamente"}), 201
    
    except (sqlite3.Error, ValueError, TypeError) as e:
        # Capturamos error de Base de Datos (ej. tipo de dato incorrecto)
        # o error de Valor (ej. int('abc'))
        # o error de Tipo (ej. int(None))
        print(f"Error al crear medicamento: {e}")
        return jsonify({"error": f"Error interno al crear el medicamento: {str(e)}"}), 500
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify({"error": "Error inesperado en el servidor"}), 500


# --- RUTAS 'VER', 'EDITAR' y 'ELIMINAR' ---
@medicamentos_bp.route('/<int:id_medicamento>', methods=['GET', 'PUT', 'DELETE'])
def handle_medicamento(id_medicamento):
    
    if request.method == 'GET':
        """Obtiene un medicamento por ID (para 'Ver' y 'Editar')."""
        medicamento = medicamento_dao.obtener_medicamento_por_id(id_medicamento)
        if medicamento:
            return jsonify(medicamento)
        return jsonify({"error": "Medicamento no encontrado"}), 404

    elif request.method == 'PUT':
        """Actualiza un medicamento por ID (para 'Editar')."""
    
        try:
            data = request.get_json()
            id_tipo_medicamento = data.get('id_tipo_medicamento')
            codigo_nacional = data.get('codigo_nacional')
            nombre = data.get('nombre')
            descripcion = data.get('descripcion')
            forma_farmaceutica = data.get('forma_farmaceutica')
            presentacion = data.get('presentacion')
            
            if not nombre or not codigo_nacional or not id_tipo_medicamento:
                return jsonify({"error": "Nombre, Código Nacional y Tipo son obligatorios"}), 400
            
            # Convertimos a entero
            id_tipo_int = int(id_tipo_medicamento)
            
            medicamento_dao.actualizar_medicamento(
                id_medicamento, 
                id_tipo_int, 
                codigo_nacional, 
                nombre, 
                descripcion, 
                forma_farmaceutica, 
                presentacion
            )
            return jsonify({"mensaje": "Medicamento actualizado exitosamente"})
        
        except (sqlite3.Error, ValueError, TypeError) as e:
            print(f"Error al actualizar medicamento: {e}")
            return jsonify({"error": f"Error interno al actualizar el medicamento: {str(e)}"}), 500
        except Exception as e:
            print(f"Error inesperado: {e}")
            return jsonify({"error": "Error inesperado en el servidor"}), 500

    elif request.method == 'DELETE':
        """Elimina un medicamento por ID."""
        try:
            medicamento_dao.eliminar_medicamento(id_medicamento)
            return jsonify({"mensaje": "Medicamento eliminado exitosamente"}), 200
        except ValueError as e:
            return jsonify({"error": str(e)}), 409
        except Exception as e:
            return jsonify({"error": f"Error al eliminar medicamento: {str(e)}"}), 500