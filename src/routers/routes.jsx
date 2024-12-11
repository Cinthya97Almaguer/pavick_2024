import { Routes,Route } from "react-router-dom";
import {
    Categorias,
    ErrorMolecula,
    Home, 
    Login, 
    Paquetes,
    Clientes,
    Productos,
    Personal, 
    Ordenes,
    ProtectedRoute,
    SpinnerLoader,
    UserAuth, 
    useUsuariosStore 
} from "../index";
import { useQuery } from "@tanstack/react-query";
import { Configuracion } from "../pages/Configuracion";

export function MyRoutes(){
    const {user} = UserAuth();
    const {mostrarUsuarios} = useUsuariosStore();
    const { data, isLoading, error } = useQuery({
        queryKey: ["mostrar usuario"], 
        queryFn: mostrarUsuarios,
    });
    if (isLoading){
        return <SpinnerLoader/>
    }
    if (error){
        return <ErrorMolecula mensaje={error.message}/>
        //<span>Error</span>
    }
    return (
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>
                <Route path="/" element={<Home />}/>
                <Route path="/configurar" element={<Configuracion />} />
                <Route path="/configurar/paquetes" element={<Paquetes />} />
                <Route path="/configurar/categorias" element={<Categorias />} />
                <Route path="/configurar/clientes" element={<Clientes />} />
                <Route path="/configurar/productos" element={<Productos />} />
                <Route path="/configurar/usuarios" element={<Personal />} />
                <Route path="/configurar/empresa" element={<Ordenes />} />
            </Route>
        </Routes>
    );
}