import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Canchas from "./pages/Canchas";
import Reserva from "./pages/Reserva";
import MisReservas from "./pages/MisReservas";
import Admin from "./pages/Admin";

import Navbar from "./components/Navbar";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Inicio />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        <Route
          path="/canchas"
          element={<Canchas />}
        />

        <Route
          path="/reservar/:id"
          element={
            <RutaProtegida>
              <Reserva />
            </RutaProtegida>
          }
        />

        <Route
          path="/mis-reservas"
          element={
            <RutaProtegida>
              <MisReservas />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin"
          element={
            <RutaProtegida soloAdmin>
              <Admin />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
