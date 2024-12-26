import React, {useState, FormEvent, useEffect} from 'react';
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:8080/login", {
                username: username,
                password: password,
            });
            setResponse(res.data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userid", res.data.userId);
            navigate("/dashboard");
            setError(null);
        }catch(error){
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    console.error("Błąd 401: Nieautoryzowany. Sprawdź login i hasło.");
                    setError("Nieprawidłowy login lub hasło.");
                } else {
                    console.error("Wystąpił inny błąd:", error.response?.status);
                }
            } else {
                console.error("Nieznany błąd:", error);
            }
        }
    };

    return (
        <div className="login d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'linear-gradient(to right, #9bb2e5, #698cbf)' }}>
            <div className="bg-light p-5 rounded-lg shadow-lg rounded" style={{width: '100%', maxWidth: '400px'}}>
                <h2 className="text-center text-primary mb-4">Logowanie</h2>
                {error ? <p style={{color: "#ff0000"}}><b>{error}</b></p> : null}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Nazwa użytkownika:</label>
                        <input
                            type="text"
                            className="form-control bg-light text-dark border-primary rounded-pill"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Hasło:</label>
                        <input
                            type="password"
                            className="form-control bg-light text-dark border-primary rounded-pill"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill">
                        Zaloguj
                    </button>
                </form>
                <div className="mt-4">Nie masz konta? <Link to="/register">Załóż konto</Link></div>
            </div>
        </div>
    );
};

export default Login;
