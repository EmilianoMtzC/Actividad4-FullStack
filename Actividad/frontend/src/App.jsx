import "./styles/style.css"
import Navbar from "./components/Navbar.jsx";
import ButtonComponent from './components/button.jsx';

function App() {
    return (
        <div>
            <Navbar/>
            <main className="page">
                <section className="action-section">
                    <div className="action-bar">
                        <ul class="action-bar-list" style={{ display: 'flex', alignItems: 'center', listStyle: 'none', gap: '2em' }}>
                            <li><span style={{ color: 'white', marginRight: '5px' }}>Sort<br/>By:</span></li>
                            <li><ButtonComponent class="sort-date-btn" text="Date" onClick={() => console.log('Ordenando por fecha')} /></li>
                            <li><ButtonComponent class="sort-type-btn" text="Type" onClick={() => console.log('Ordenando por tipo')} /></li>
                        </ul>
                        <ButtonComponent class="add-btn" text="+" onClick={() => alert('Añadir nuevo')} />

                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;