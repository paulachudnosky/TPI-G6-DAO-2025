import React from 'react';
import { useParams } from 'react-router-dom';
import especialidadService from '../../services/especialidadService';

const EspecialidadView = () => {
    const { id } = useParams();
    const [especialidad, setEspecialidad] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchEspecialidad = async () => {
            try {
                const data = await especialidadService.getEspecialidadById(id);
                setEspecialidad(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEspecialidad();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Detalles de Especialidad</h1>
            {especialidad ? (
                <div>
                    <h2>{especialidad.nombre}</h2>
                    <p>{especialidad.descripcion}</p>
                    {/* Add more fields as necessary */}
                </div>
            ) : (
                <p>No se encontró la especialidad.</p>
            )}
        </div>
    );
};

export default EspecialidadView;