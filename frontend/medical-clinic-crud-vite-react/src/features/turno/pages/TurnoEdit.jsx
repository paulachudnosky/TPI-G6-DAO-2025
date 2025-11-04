import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TurnoForm from '../components/TurnoForm';
import { getTurnoById, updateTurno } from '../services/turnoService';

const TurnoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [turno, setTurno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTurno = async () => {
            try {
                const data = await getTurnoById(id);
                setTurno(data);
            } catch (err) {
                setError('Error fetching turno data');
            } finally {
                setLoading(false);
            }
        };

        fetchTurno();
    }, [id]);

    const handleUpdate = async (updatedTurno) => {
        try {
            await updateTurno(id, updatedTurno);
            navigate('/turno'); // Redirect to the list page after update
        } catch (err) {
            setError('Error updating turno');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Edit Turno</h2>
            {turno && <TurnoForm initialData={turno} onSubmit={handleUpdate} />}
        </div>
    );
};

export default TurnoEdit;