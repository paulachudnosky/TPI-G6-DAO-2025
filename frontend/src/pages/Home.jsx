// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { FaCalendarAlt, FaUserMd, FaUserInjured } from 'react-icons/fa';

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
                            <p>No se encontraron turnos. (Aquí iría una tabla o lista con datos reales)</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Home;