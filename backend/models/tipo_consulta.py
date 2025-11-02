class TipoConsulta:
    def __init__(self, nombre, descripcion, duracion_minutos, id_tipo=None):
        self.id_tipo = id_tipo
        self.nombre = nombre
        self.descripcion = descripcion
        self.duracion_minutos = duracion_minutos

    def to_dict(self):
        return {
            "id_tipo": self.id_tipo,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "duracion_minutos": self.duracion_minutos
        }
