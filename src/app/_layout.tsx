import { NavegacionRaiz } from '../components/NavegacionRaiz';
import { BibliotecaProvider } from '../context/BibliotecaProvider';

export default function RootLayout() {
  // el Stack va en un componente aparte porque necesita leer la sesion del Provider que se monta acá
  return (
    <BibliotecaProvider>
      <NavegacionRaiz />
    </BibliotecaProvider>
  );
}
