class HistorialClinico:
    def __init__(self, id_paciente, fecha_creacion, grupo_sanguineo, estado, id_historial=None):
        self.id_historial = id_historial
        self.id_paciente = id_paciente
        self.fecha_creacion = fecha_creacion
        self.grupo_sanguineo = grupo_sanguineo
        self.estado = estado

    def to_dict(self):
        return {
            "id_historial": self.id_historial,
            "id_paciente": self.id_paciente,
            "fecha_creacion": self.fecha_creacion,
            "grupo_sanguineo": self.grupo_sanguineo,
            "estado": self.estado
        }