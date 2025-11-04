class Turno:
    def __init__(self, id_paciente, id_medico, id_tipo_consulta, 
                 fecha_hora_inicio, fecha_hora_fin, estado, 
                 id_especialidad=None, id_turno=None):
        self.id_turno = id_turno
        self.id_paciente = id_paciente
        self.id_medico = id_medico
        self.id_especialidad = id_especialidad
        self.id_tipo_consulta = id_tipo_consulta
        self.fecha_hora_inicio = fecha_hora_inicio
        self.fecha_hora_fin = fecha_hora_fin
        self.estado = estado

    def to_dict(self):
        """Convierte el objeto Turno a un diccionario."""
        return {
            "id_turno": self.id_turno,
            "id_paciente": self.id_paciente,
            "id_medico": self.id_medico,
            "id_especialidad": self.id_especialidad,
            "id_tipo_consulta": self.id_tipo_consulta,
            "fecha_hora_inicio": self.fecha_hora_inicio,
            "fecha_hora_fin": self.fecha_hora_fin,
            "estado": self.estado
        }
