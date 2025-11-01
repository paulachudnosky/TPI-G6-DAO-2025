class HorarioAtencion:
    def __init__(self, id_medico, dia_semana, hora_inicio, hora_fin, id_horario=None):
        self.id_horario = id_horario
        self.id_medico = id_medico
        self.dia_semana = dia_semana
        self.hora_inicio = hora_inicio
        self.hora_fin = hora_fin

    def to_dict(self):
        return {
            "id_horario": self.id_horario,
            "id_medico": self.id_medico,
            "dia_semana": self.dia_semana,
            "hora_inicio": self.hora_inicio,
            "hora_fin": self.hora_fin
        }
