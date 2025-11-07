class Consulta:
    def __init__(self, id_turno, motivo_consulta, observaciones, id_consulta=None):
        self.id_consulta = id_consulta
        self.id_turno = id_turno
        self.motivo_consulta = motivo_consulta
        self.observaciones = observaciones

    def to_dict(self):
        """Convierte el objeto Consulta a un diccionario."""
        return {
            "id_consulta": self.id_consulta,
            "id_turno": self.id_turno,
            "motivo_consulta": self.motivo_consulta,
            "observaciones": self.observaciones
        }
