// src/components/layout/Layout.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AppNavbar from './Navbar'; // Importamos el Navbar (asumiendo que lo reemplazaste)
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            <AppNavbar /> {/* La cabecera blanca de arriba */}

            <Container fluid style={{ flex: 1 }}>
                <Row style={{ minHeight: 'calc(100vh - 56px)' }}>
                    
                    {/* ESTA ES LA COLUMNA CLAVE */}
                    <Col md={3} lg={2} className="bg-dark p-3"> {/* <-- Fondo Negro */}
                        <Sidebar /> {/* Y adentro va tu sidebar nueva */}
                    </Col>

                    {/* El contenido de tu página (Home, Turno, Medico, etc.) */}
                    <Col md={9} lg={10} className="p-4 bg-light">
                        {children}
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default Layout;