class TipoConsulta:
    def __init__(self, nombre, descripcion, duracion_minutos, id_tipo_consulta=None):
        self.id_tipo_consulta = id_tipo_consulta
        self.nombre = nombre
        self.descripcion = descripcion
        self.duracion_minutos = duracion_minutos

    def to_dict(self):
        return {
            "id_tipo_consulta": self.id_tipo_consulta,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "duracion_minutos": self.duracion_minutos
        }
