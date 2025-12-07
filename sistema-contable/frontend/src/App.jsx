import React, { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Menús
import MenuAdministrador from "./pages/MenuAdministrador.jsx";
import MenuComprador from "./pages/MenuComprador.jsx";
import MenuContador from "./pages/MenuContador.jsx";

// Vistas Contables
import RegistrarAsiento from "./pages/RegistrarAsiento.jsx";
import PlanDeCuentas from "./pages/PlanDeCuentas.jsx";
import LibroDiario from "./pages/LibroDiario.jsx"; // <<< 1. IMPORTACIÓN AÑADIDA

// Gestión de Usuarios
import GestionDeUsuarios from "./pages/GestionUsuarios.jsx";
import AltaUsuarios from "./pages/AltaUsuario.jsx";
import BajaUsuarios from "./pages/BajaUsuario.jsx";

// Gestión de Cuentas
import GestionDeCuentas from "./pages/GestionDeCuentas.jsx";
import AltaCuentas from "./pages/AltaCuentas.jsx";
import BajaCuentas from "./pages/BajaCuentas.jsx";
import ModificacionCuentas from "./pages/ModificacionCuentas.jsx";

// Reportes
// import VerReportes from "./pages/VerReportes.jsx";

const AdminLayout = ({ onLogout }) => (
    <MenuAdministrador onLogout={onLogout}>
        <Outlet />
    </MenuAdministrador>
);

function App() {
    const [token, setToken] = useState(null);
    const [rol, setRol] = useState("");
    const [currentPage, setCurrentPage] = useState("DASHBOARD");

    // <<< 2. ACTIVAR PERSISTENCIA DE SESIÓN >>>
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRol = localStorage.getItem("rol");
        if (storedToken) setToken(storedToken);
        // Aseguramos que el rol esté en mayúsculas y limpio al cargar
        if (storedRol) setRol(storedRol.trim().toUpperCase());
    }, []);
    // ------------------------------------------

    const handleLogin = (newToken, newRol) => {
        console.log("Login recibido:", newToken, newRol);
        localStorage.setItem("token", newToken);
        localStorage.setItem("rol", newRol);
        setToken(newToken);
        setRol(newRol.trim().toUpperCase()); // normalizamos
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        setToken(null);
        setRol("");
        setCurrentPage("DASHBOARD");
    };

    const handlePageChange = (pageName) => {
        setCurrentPage(pageName);
    };

    if (!token) {
        return <Login onLogin={handleLogin} />;
    }

    // Función que decide qué componente de contenido mostrar
    const renderContent = (rol) => {
        switch (currentPage) {
            // --- Vistas Contables ---
            case "REGISTRAR_ASIENTO":
                return <RegistrarAsiento onPageChange={handlePageChange} />;

            // <<< 3. AGREGAR RUTA LIBRO DIARIO >>>
            case "LIBRO_DIARIO":
                return <LibroDiario onPageChange={handlePageChange} />;

            case "PLAN_DE_CUENTAS":
                return <PlanDeCuentas onPageChange={handlePageChange} />;

            // --- Gestión de Usuarios ---
            case "GESTION_USUARIOS":
                return <GestionDeUsuarios onPageChange={handlePageChange} />;
            case "ALTA_USUARIO":
                return <AltaUsuarios onPageChange={handlePageChange} />;
            case "BAJA_USUARIO":
                return <BajaUsuarios onPageChange={handlePageChange} />;

            // --- Gestión de Cuentas ---
            case "GESTION_CUENTAS":
                return <GestionDeCuentas onPageChange={handlePageChange} />;
            case "ALTA_CUENTA":
                return <AltaCuentas onPageChange={handlePageChange} />;
            case "BAJA_CUENTA":
                return <BajaCuentas onPageChange={handlePageChange} />;
            case "MODIFICACION_CUENTA":
                return <ModificacionCuentas onPageChange={handlePageChange} />;

            // --- Reportes ---
            case "VER_REPORTES":
                // Verifica si has descomentado la importación de VerReportes
                // return <VerReportes onPageChange={handlePageChange} />;
                return <p>Reportes no implementados aún.</p>

            // --- Menús de Navegación (DASHBOARD) ---
            case "DASHBOARD":
            default:
                switch (rol) {
                    case "ADMINISTRADOR":
                        return <MenuAdministrador onLogout={handleLogout} onPageChange={handlePageChange} />;
                    case "CONTADOR":
                        return <MenuContador onLogout={handleLogout} onPageChange={handlePageChange} />;
                    case "COMPRADOR":
                        return <MenuComprador onLogout={handleLogout} onPageChange={handlePageChange} />;
                    default:
                        return <p>Rol no reconocido: {rol}</p>;
                }
        }
    };

    console.log("Token:", token ? "Existe" : "Null", "Rol normalizado:", rol, "Página:", currentPage);

    return renderContent(rol);
}

export default App;