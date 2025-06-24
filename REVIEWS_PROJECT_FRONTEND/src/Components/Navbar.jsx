import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo2.png'


function Navbar() {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/LoginPage');
    };

    const location = useLocation();

    const isActive =
        location.pathname === '/Normaluser/Stores' ||
        location.pathname.startsWith('/ListStorePage/');
        

    return (
        <header className="navbar sticky-navigation">

            <div className="logo-section">
                <div className="logo-border">
                    <div className="hover-circle">
                        <img src={logo} alt="Logo" className="Logo-image" />
                    </div>
                </div>
                <div className="logo1">Place Pulse</div>
            </div>


            <nav>
                <ul className="navbar-list">

                    {isLoggedIn && userRole === 'System Administrator' && (
                        <>

                            <li>
                                <a
                                    className={window.location.pathname === '/admin/AdminDashboard' || '' ? 'active' : ''}
                                    onClick={() => navigate('/admin/AdminDashboard')}
                                >
                                    Dashboard
                                </a>
                            </li>

                            <li>
                                <a
                                    className={window.location.pathname === '/admin/ManageUsers' || window.location.pathname === '/admin/ManageUsers/AddUser' ? 'active' : ''}
                                    onClick={() => navigate('/admin/ManageUsers')}
                                >
                                    Manage Users
                                </a>
                            </li>
                            <li>
                                <a
                                    className={window.location.pathname === '/admin/ManageStores' || window.location.pathname === '/admin/ManageStores/AddStore'? 'active' : ''}
                                    onClick={() => navigate('/admin/ManageStores')}
                                >
                                    Manage Stores
                                </a>
                            </li>
                        </>
                    )}

                    {isLoggedIn && userRole === 'Normal User' && (
                        <>

                            <li>
                                <a
                                    className={isActive ? 'active' : ''}
                                    onClick={() => navigate('/Normaluser/Stores')}
                                >
                                    Stores
                                </a>
                            </li>
                            <li>
                                <a
                                    className={window.location.pathname === '/Normaluser/UpdatePassword' ? 'active' : ''}
                                    onClick={() => navigate('/Normaluser/UpdatePassword')}
                                >
                                    Update password
                                </a>
                            </li>
                        </>
                    )}

                    {isLoggedIn && userRole === 'Store Owner' && (
                        <>
                            <li>
                                <a
                                    className={window.location.pathname === '/OwnerUser/OwnerDashboard' ? 'active' : ''}
                                    onClick={() => navigate('/OwnerUser/OwnerDashboard')}
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a
                                    className={window.location.pathname === '/OwnerUser/UpdatePassword' ? 'active' : ''}
                                    onClick={() => navigate('/OwnerUser/UpdatePassword')}
                                >
                                    Update Password
                                </a>
                            </li>
                        </>
                    )}

                    {!isLoggedIn ? (
                        <>
                            <li>
                                <a
                                    className={window.location.pathname === '/LoginPage' ? 'active' : ''}
                                    onClick={() => navigate('/LoginPage')}
                                >
                                    Login
                                </a>
                            </li>
                            <li>
                                <a
                                    className={window.location.pathname === '/' ? 'active' : ''}
                                    onClick={() => navigate('/')}
                                >
                                    Signup
                                </a>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;
