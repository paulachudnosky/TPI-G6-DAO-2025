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
        <div className="stat-card">
            <h4 className="stat-card-title">Gráfico de Asistencia de Turnos</h4>
            <div className="stat-filters">
                <div className="entity-form-group">
                    <label className="entity-form-label">Desde</label>
                    <input type="date" name="fecha_inicio" value={fechas.fecha_inicio} onChange={handleChange} className="entity-form-input" />
                </div>
                <div className="entity-form-group">
                    <label className="entity-form-label">Hasta</label>
                    <input type="date" name="fecha_fin" value={fechas.fecha_fin} onChange={handleChange} className="entity-form-input" />
                </div>
                <button onClick={handleSearch} disabled={loading} className="btn-entity-primary">
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            {error && <div className="entity-alert entity-alert-danger" style={{ marginTop: '1rem' }}>{error}</div>}

            {data && (
                <div className="chart-and-legend-container">
                    <div className="chart-wrapper-large">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>
            )}
            {!data && !loading && <p className="entity-text-muted" style={{ marginTop: '1rem' }}>Seleccione un rango de fechas y haga clic en "Buscar".</p>}
        </div>
    );
};

export default EstadoTurnos;