import { Navbar } from 'react-bootstrap';
import '../styles/bootstrap.min.css';
import '../styles/globals.css';
import NavBar from "./component/Navbar";

function MyApp({ Component, pageProps }) {
  return <NavBar><Component {...pageProps} /></NavBar>
}

export default MyApp

