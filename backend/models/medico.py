class Medico:
    def __init__(self, nombre, apellido, matricula, email, id_especialidad=None, id_medico=None, activo=True):
        self.id_medico = id_medico
        self.nombre = nombre
        self.apellido = apellido
        self.matricula = matricula
        self.email = email
        self.id_especialidad = id_especialidad
        self.activo = activo

    def to_dict(self):
        return {
            "id_medico": self.id_medico,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "matricula": self.matricula,
            "email": self.email,
            "id_especialidad": self.id_especialidad,
            "activo": self.activo
        }