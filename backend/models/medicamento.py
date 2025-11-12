class Medicamento:
    def __init__(self, id_tipo_medicamento, codigo_nacional, nombre, descripcion, forma_farmaceutica=None, presentacion=None, id_medicamento=None):
        self.id_medicamento = id_medicamento
        self.id_tipo_medicamento = id_tipo_medicamento
        self.codigo_nacional = codigo_nacional
        self.nombre = nombre
        self.descripcion = descripcion
        self.forma_farmaceutica = forma_farmaceutica
        self.presentacion = presentacion

    def to_dict(self):
        return {
            "id_medicamento": self.id_medicamento,
            "id_tipo_medicamento": self.id_tipo_medicamento,
            "codigo_nacional": self.codigo_nacional,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "forma_farmaceutica": self.forma_farmaceutica,
            "presentacion": self.presentacion
        }
