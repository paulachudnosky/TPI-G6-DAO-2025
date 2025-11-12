import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Image } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';

const AppNavbar = () => { // Renombrado a AppNavbar para evitar colisión
    return (
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    <img src="/logo_hospital.jpg" width="60" alt="Logo" /> 
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <NavDropdown 
                            title={
                                <span className="text-dark">
                                    <Image src="/usuario_predeterminado.jpg" roundedCircle width="30" height="30" className="me-2" />
                                    Usuario
                                </span>
                            } 
                            id="basic-nav-dropdown" 
                            align="end"
                        >
                            <NavDropdown.Item href="#perfil" className="text-dark">Mi Perfil</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#logout" className="text-dark">
                                <FaSignOutAlt className="me-2" /> Cerrar Sesión
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;