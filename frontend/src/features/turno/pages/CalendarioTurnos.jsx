import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerTurnosMes, actualizarTurnosVencidos } from '../services/turnoService';
import '../styles/calendario-turnos.css';

const CalendarioTurnos = () => {
    const navigate = useNavigate();
    const [anioActual, setAnioActual] = useState(new Date().getFullYear());
    const [mesActual, setMesActual] = useState(new Date().getMonth() + 1); // Enero = 1
    const [turnosPorDia, setTurnosPorDia] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    useEffect(() => {
        // Actualizar turnos vencidos al cargar el calendario
        actualizarTurnosVencidos().catch(err => console.warn('No se pudieron actualizar turnos vencidos:', err));
        cargarTurnos();
    }, [anioActual, mesActual]);

    const cargarTurnos = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerTurnosMes(anioActual, mesActual);
            // Convertir array a objeto con fecha como clave para acceso rápido
            const turnosMap = {};
            data.forEach(item => {
                turnosMap[item.fecha] = item.cantidad;
            });
            setTurnosPorDia(turnosMap);
        } catch (err) {
            setError('Error al cargar los turnos del mes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const cambiarMes = (direccion) => {
        let nuevoMes = mesActual + direccion;
        let nuevoAnio = anioActual;

        if (nuevoMes > 12) {
            nuevoMes = 1;
            nuevoAnio++;
        } else if (nuevoMes < 1) {
            nuevoMes = 12;
            nuevoAnio--;
        }

        setMesActual(nuevoMes);
        setAnioActual(nuevoAnio);
    };

    const obtenerDiasDelMes = () => {
        const primerDia = new Date(anioActual, mesActual - 1, 1);
        const ultimoDia = new Date(anioActual, mesActual, 0);
        const diasEnMes = ultimoDia.getDate();
        const primerDiaSemana = primerDia.getDay(); // 0 = Domingo

        const dias = [];

        // Agregar espacios vacíos antes del primer día
        for (let i = 0; i < primerDiaSemana; i++) {
            dias.push(null);
        }

        // Agregar los días del mes
        for (let dia = 1; dia <= diasEnMes; dia++) {
            dias.push(dia);
        }

        return dias;
    };

    const formatearFecha = (dia) => {
        const mes = mesActual.toString().padStart(2, '0');
        const diaStr = dia.toString().padStart(2, '0');
        return `${anioActual}-${mes}-${diaStr}`;
    };

    const handleClickDia = (dia) => {
        if (dia === null) return;
        const fecha = formatearFecha(dia);
        navigate(`/turnos/dia/${fecha}`);
    };

    const esHoy = (dia) => {
        const hoy = new Date();
        return (
            dia === hoy.getDate() &&
            mesActual === hoy.getMonth() + 1 &&
            anioActual === hoy.getFullYear()
        );
    };

    const diasDelMes = obtenerDiasDelMes();

    if (loading) {
        return <div className="entity-loading">Cargando calendario...</div>;
    }

    return (
        <div className="entity-container calendario-container">
            <div className="entity-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>📅 Calendario de Turnos</h2>
                <button
                    className="btn-entity-primary"
                    onClick={() => navigate('/turnos/nuevo')}
                >
                    ➕ Nuevo Turno
                </button>
            </div>

            {error && (
                <div className="entity-alert entity-alert-danger">{error}</div>
            )}

            {/* Navegación del mes */}
            <div className="calendario-navegacion">
                <button
                    className="btn-calendario-nav"
                    onClick={() => cambiarMes(-1)}
                    title="Mes anterior"
                >
                    ◀ Anterior
                </button>
                <h3 className="calendario-titulo-mes">
                    {nombresMeses[mesActual - 1]} {anioActual}
                </h3>
                <button
                    className="btn-calendario-nav"
                    onClick={() => cambiarMes(1)}
                    title="Mes siguiente"
                >
                    Siguiente ▶
                </button>
            </div>

            {/* Calendario */}
            <div className="calendario-grid">
                {/* Headers de días de la semana */}
                {diasSemana.map(dia => (
                    <div key={dia} className="calendario-dia-header">
                        {dia}
                    </div>
                ))}

                {/* Días del mes */}
                {diasDelMes.map((dia, index) => {
                    if (dia === null) {
                        return <div key={`empty-${index}`} className="calendario-dia-vacio" />;
                    }

                    const fecha = formatearFecha(dia);
                    const cantidadTurnos = turnosPorDia[fecha] || 0;
                    const isHoy = esHoy(dia);

                    return (
                        <div
                            key={dia}
                            className={`calendario-dia ${isHoy ? 'calendario-dia-hoy' : ''} ${cantidadTurnos > 0 ? 'calendario-dia-con-turnos' : ''}`}
                            onClick={() => handleClickDia(dia)}
                            title={cantidadTurnos > 0 ? `${cantidadTurnos} turno(s)` : 'Sin turnos'}
                        >
                            <span className="calendario-dia-numero">{dia}</span>
                            {cantidadTurnos > 0 && (
                                <span className="calendario-badge">
                                    {cantidadTurnos}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Leyenda */}
            <div className="calendario-leyenda">
                <div className="leyenda-item">
                    <div className="leyenda-cuadro leyenda-hoy"></div>
                    <span>Día actual</span>
                </div>
                <div className="leyenda-item">
                    <div className="leyenda-cuadro leyenda-con-turnos"></div>
                    <span>Con turnos</span>
                </div>
                <div className="leyenda-item">
                    <div className="leyenda-cuadro leyenda-sin-turnos"></div>
                    <span>Sin turnos</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarioTurnos;
