import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            <Navbar />
            <div className="container-fluid flex-grow-1">
                <div className="row h-100">
                    <aside className="col-12 col-md-3 col-lg-2 bg-white border-end p-0">
                        <Sidebar />
                    </aside>
                    <main className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;