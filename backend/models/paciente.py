class Paciente:
    def __init__(self, nombre, apellido, dni, fecha_nacimiento, email, telefono, id_paciente=None, activo=True):
        self.id_paciente = id_paciente
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.fecha_nacimiento = fecha_nacimiento
        self.email = email
        self.telefono = telefono
        self.activo = activo

    def to_dict(self):
        return {
            "id_paciente": self.id_paciente,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "dni": self.dni,
            "fecha_nacimiento": self.fecha_nacimiento,
            "email": self.email,
            "telefono": self.telefono,
            "activo": self.activo
        }