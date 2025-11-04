class TipoMedicamento:
    def __init__(self, nombre, id_tipo_medicamento=None):
        self.id_tipo_medicamento = id_tipo_medicamento
        self.nombre = nombre

    def to_dict(self):
        return {
            "id_tipo_medicamento": self.id_tipo_medicamento,
            "nombre": self.nombre
        }
