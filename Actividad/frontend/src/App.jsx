import "./styles/style.css"
import Navbar from "./components/Navbar.jsx";
import ButtonComponent from './components/button.jsx';

function App() {
    return (
        <div>
            <Navbar />
            <main className="page">
                <h1>Mi App</h1>
                <ButtonComponent />
            </main>
        </div>
    );
}

export default App;
