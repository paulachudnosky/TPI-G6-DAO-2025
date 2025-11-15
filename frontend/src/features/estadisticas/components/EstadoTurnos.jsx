import React, { useState } from 'react';
import { getEstadoTurnos } from '../services/estadisticasService';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const EstadoTurnos = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fechas, setFechas] = useState({ fecha_inicio: '', fecha_fin: '' });

    const handleChange = (e) => {
        setFechas({ ...fechas, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        // Si la fecha "Hasta" está vacía, usamos la fecha actual para la validación.
        const fechaFinValidacion = fechas.fecha_fin || new Date().toISOString().split('T')[0];

        // Validamos solo si hay una fecha de inicio
        if (fechas.fecha_inicio && fechas.fecha_inicio > fechaFinValidacion) {
            setError('La fecha "Desde" no puede ser posterior a la fecha "Hasta". Si "Hasta" está vacío, se compara con la fecha de hoy.');
            setData(null); // Limpiamos resultados anteriores si los hay
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (fechas.fecha_inicio) params.fecha_inicio = fechas.fecha_inicio;
            if (fechas.fecha_fin) params.fecha_fin = fechas.fecha_fin;

            const result = await getEstadoTurnos(params);
            setData(result);
        } catch (err) {
            setError('No se pudieron cargar las estadísticas de estado de turnos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Prepara los datos para el gráfico de torta una vez que 'data' está disponible
    const chartData = data ? {
        labels: ['Asistidos', 'No Asistidos'],
        datasets: [
            {
                label: 'Cantidad de Turnos',
                data: [data.asistidos, data.no_asistidos_cancelado + data.no_asistidos_ausente],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Verde para Asistidos
                    'rgba(255, 99, 132, 0.6)', // Rojo para No Asistidos
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    } : null;

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Ocultamos la leyenda externa, la info estará dentro
            },
            datalabels: {
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                    return `${label}\n\n${value} (${percentage})`;
                },
                color: '#fff',
                textAlign: 'center',
                font: {
                    weight: 'bold',
                    size: 14,
                },
                // Estilo para que parezca una etiqueta con flecha
                backgroundColor: (context) => context.dataset.borderColor[context.dataIndex],
                borderRadius: 4,
                padding: 6
            }
        }
    };

    return (
        <div className="report-layout">
            {/* Columna de Filtros (Izquierda) */}
            <div className="report-filters">
                <h3 className="report-section-title">Filtros</h3>
                <div className="entity-form-group">
                    <label className="entity-form-label">Desde</label>
                    <input type="date" name="fecha_inicio" value={fechas.fecha_inicio} onChange={handleChange} className="entity-form-input" />
                </div>
                <div className="entity-form-group">
                    <label className="entity-form-label">
                        Hasta <span className="entity-text-muted" style={{ fontWeight: 'normal', fontSize: '0.8em' }}>(por defecto: hoy)</span>
                    </label>
                    <input type="date" name="fecha_fin" value={fechas.fecha_fin} onChange={handleChange} className="entity-form-input" />
                </div>
                <button onClick={handleSearch} disabled={loading} className="btn-entity-primary">
                    {loading ? 'Buscando...' : 'Generar Gráfico'}
                </button>
            </div>

            {/* Columna de Resultados (Derecha) */}
            <div className="report-results">
                <h3 className="report-section-title">Gráfico de Asistencia</h3>
                {error && <div className="entity-alert entity-alert-danger">{error}</div>}
                
                {loading ? (
                    <div className="entity-loading">Cargando...</div>
                ) : data ? (
                    <div className="chart-wrapper-large">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                ) : (
                    <div className="empty-state">Seleccione un rango de fechas (opcional) y haga clic en "Generar Gráfico".</div>
                )}
            </div>
        </div>
    );
};

export default EstadoTurnos;