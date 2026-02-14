function Navbar() {
    return (
        <nav className="navbar">
            <style>{`
                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1em 4em 1em 4em;
                    background-color: #303030;
                    color: white;
                }
                
                .navbar__logo {
                    display:flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    background-color: #202020;
                    width: 10em;
                    height: 2.4em;
                }
                    
                .navbar__links {
                    display: flex;
                    list-style: none;
                    justify-content: center;
                    flex-align: center;
                    background-color: #303030;
                }
                .navbar__links a {
                    color: none;
                    text-decoration: none;
                    background-color: #303030;
                    
                }
                
                .profile {
                    width: 3em;
                    height: 3em;
                    background-color: #202020;
                    border-radius: 50px;
                    border: none;
                }
                
            `}</style>

            <div className="navbar__logo"></div>
            <ul className="navbar__links">
                <li><a href="#profile"><div className="profile"></div></a></li>
            </ul>
        </nav>
    );
}

export default Navbar;

