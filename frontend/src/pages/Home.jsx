// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { FaCalendarAlt, FaUserMd, FaUserInjured } from 'react-icons/fa';
import { obtenerTurnosPorDia } from '../features/turno/services/turnoService';
import '../styles/entity-base.css'; // Para estilos de paginación

// Estilos solo para las tarjetas de este Home
const cardStyles = {
    cardImage: {
        height: '200px',
        objectFit: 'cover'
    },
    cardFooter: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: '1.2rem',
        padding: '1rem'
    },
    cardIcon: {
        marginRight: '10px',
        fontSize: '1.5rem'
    },
    orange: { backgroundColor: '#E87A5E', borderColor: '#E87A5E' },
    purple: { backgroundColor: '#8B68A6', borderColor: '#8B68A6' },
    green: { backgroundColor: '#7DC475', borderColor: '#7DC475' }
};

const Home = () => {
    const [turnosHoy, setTurnosHoy] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchTurnosHoy = async () => {
            try {
                const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
                const data = await obtenerTurnosPorDia(hoy);
                setTurnosHoy(data);
            } catch (err) {
                setError('No se pudieron cargar los turnos de hoy.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnosHoy();
    }, []);

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = turnosHoy.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(turnosHoy.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderTablaTurnos = () => {
        if (loading) return <p>Cargando turnos...</p>;
        if (error) return <p className="text-danger">{error}</p>;
        if (currentItems.length === 0) return <p>No hay turnos programados para hoy.</p>;

        return (
            <Table striped bordered hover responsive size="sm">
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Especialidad</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(turno => (
                        <tr key={turno.id_turno}>
                            <td>{new Date(turno.fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{`${turno.paciente_nombre || ''} ${turno.paciente_apellido || ''}`.trim()}</td>
                            <td>{`Dr/a. ${turno.medico_nombre || ''} ${turno.medico_apellido || ''}`.trim()}</td>
                            <td>{turno.especialidad_nombre || 'No asignada'}</td>
                            <td><span className={`entity-badge ${turno.estado === 'Programado' ? 'entity-badge-info' : 'entity-badge-secondary'}`}>{turno.estado}</span></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    return (
        // El layout (fondo, etc.) ya viene de Layout.jsx
        <>
            <h1 className="h3 mb-4">Bienvenido</h1>

            {/* Fila de Tarjetas Principales */}
            <Row>
                <Col lg={4} className="mb-4">
                    <Card as={Link} to="/turno" className="text-decoration-none shadow-sm">
                        <Card.Img variant="top" src="/turnos.jpg" style={cardStyles.cardImage} />
                        <Card.Footer style={{ ...cardStyles.cardFooter, ...cardStyles.orange }}>
                            <FaCalendarAlt style={cardStyles.cardIcon} /> GESTIONAR TURNOS
                        </Card.Footer>
                    </Card>
                </Col>
                <Col lg={4} className="mb-4">
                    <Card as={Link} to="/medico" className="text-decoration-none shadow-sm">
                        <Card.Img variant="top" src="/medicos.jpg" style={cardStyles.cardImage} />
                        <Card.Footer style={{ ...cardStyles.cardFooter, ...cardStyles.purple }}>
                            <FaUserMd style={cardStyles.cardIcon} /> GESTIONAR MÉDICOS
                        </Card.Footer>
                    </Card>
                </Col>
                <Col lg={4} className="mb-4">
                    <Card as={Link} to="/pacientes" className="text-decoration-none shadow-sm">
                        <Card.Img variant="top" src="/pacientes.jpg" style={cardStyles.cardImage} />
                        <Card.Footer style={{ ...cardStyles.cardFooter, ...cardStyles.green }}>
                            <FaUserInjured style={cardStyles.cardIcon} /> GESTIONAR PACIENTES
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {/* Fila de Widgets (Resúmenes) */}
            <Row>
                <Col lg={12} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Header>Próximos Turnos</Card.Header>
                        <Card.Body>
                            {renderTablaTurnos()}
                        </Card.Body>
                        {totalPages > 1 && (
                            <Card.Footer className="d-flex justify-content-center align-items-center">
                                <div className="pagination-container" style={{ margin: 0 }}>
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="btn-entity-secondary btn-entity-sm"
                                    >
                                        Anterior
                                    </button>
                                    <span>Página {currentPage} de {totalPages}</span>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="btn-entity-secondary btn-entity-sm"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </Card.Footer>
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Home;