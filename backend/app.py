from flask import Flask, jsonify, request
from flask_cors import CORS
# Importamos la función para crear la BD
from database import crear_base_de_datos_si_no_existe

# Importamos nuestros blueprints
from routes.medicos_routes import medicos_bp
from routes.pacientes_routes import pacientes_bp
from routes.especialidades_routes import especialidades_bp
from routes.turnos_routes import turnos_bp
from routes.horarios_routes import horarios_bp
from routes.tipoconsulta_routes import tipos_consulta_bp
# from routes.tipomedicamento_routes import tipos_medicamento_bp
from routes.tipo_medicamento_routes import tipos_medicamento_bp
from routes.medicamento_routes import medicamentos_bp
from routes.consultas_routes import consultas_bp
from routes.estadisticas_routes import estadisticas_bp


app = Flask(__name__)

# Deshabilitar el redirect automático de barras finales para evitar problemas con CORS
app.url_map.strict_slashes = False

# Habilitar CORS para permitir llamadas desde el frontend en desarrollo
# Configuración más permisiva para desarrollo
CORS(app, 
     resources={r"/*": {
         "origins": ["http://localhost:3000", "http://localhost:5173"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
     }
}) 

# --- REGISTRO DE BLUEPRINTS ---
app.register_blueprint(medicos_bp)
app.register_blueprint(pacientes_bp)
app.register_blueprint(especialidades_bp)
app.register_blueprint(turnos_bp)
app.register_blueprint(horarios_bp)
app.register_blueprint(tipos_consulta_bp)
app.register_blueprint(tipos_medicamento_bp)
app.register_blueprint(medicamentos_bp)
app.register_blueprint(consultas_bp)
app.register_blueprint(estadisticas_bp)


if __name__ == '__main__':
    crear_base_de_datos_si_no_existe()
    app.run(debug=True)