import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import EspecialidadTable from '../components/EspecialidadTable';
import { getEspecialidades, deleteEspecialidad } from '../services/especialidadService';

const EspecialidadList = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                const data = await getEspecialidades();
                setEspecialidades(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEspecialidades();
    }, []);

    if (loading) return <div className="alert alert-info">Cargando...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container-fluid">
            <PageHeader title="Especialidades" to="/especialidad/create" buttonText="Nueva Especialidad" color="success" />
            <EspecialidadTable especialidades={especialidades} />
        </div>
    );
};

export default EspecialidadList;