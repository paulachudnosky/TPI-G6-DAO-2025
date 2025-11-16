# models/especialidad.py
class Especialidad:
    def __init__(self, nombre, descripcion, id_especialidad=None, activo=True):
        self.id_especialidad = id_especialidad
        self.nombre = nombre
        self.descripcion = descripcion
        self.activo = activo

    def to_dict(self):
        """Convierte el objeto Especialidad a un diccionario."""
        return {
            "id_especialidad": self.id_especialidad,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "activo": self.activo
        }