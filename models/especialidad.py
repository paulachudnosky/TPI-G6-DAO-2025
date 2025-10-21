# models/especialidad.py
class Especialidad:
    def __init__(self, nombre, descripcion, id_especialidad=None):
        self.id_especialidad = id_especialidad
        self.nombre = nombre
        self.descripcion = descripcion

    def to_dict(self):
        """Convierte el objeto Especialidad a un diccionario."""
        return {
            "id_especialidad": self.id_especialidad,
            "nombre": self.nombre,
            "descripcion": self.descripcion
        }