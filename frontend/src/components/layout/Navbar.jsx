import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Image } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';

const AppNavbar = () => { // Renombrado a AppNavbar para evitar colisión
    return (
        <Navbar bg="white" expand="lg" className="shadow-sm navbar-elegant">
            <Container fluid className="px-4">
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src="/logo_hospital.jpg" width="60" alt="Logo" className="me-3" />
                    <h1 className="hospital-title mb-0">Clínica Curae</h1>
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
