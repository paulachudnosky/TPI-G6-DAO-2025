class Medico:
    def __init__(self, nombre, apellido, matricula, email, id_medico=None):
        self.id_medico = id_medico
        self.nombre = nombre
        self.apellido = apellido
        self.matricula = matricula
        self.email = email

    def to_dict(self):
        return {
            "id_medico": self.id_medico,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "matricula": self.matricula,
            "email": self.email
        }