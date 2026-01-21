import React, { useState, useEffect } from 'react';

function App() {
  const [view, setView] = useState('loading'); // 'loading', 'register', 'login', 'calculator'
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Проверка при загрузке страницы
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (token) {
        setView('calculator');
    } else if (!hasVisited) {
        // Если первый раз на сайте
        setView('register');
    } else {
        // Если уже был раньше
        setView('login');
    }
  }, [token]);

  // Функция успешного входа
  const onLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
    setView('calculator');
    localStorage.setItem('hasVisited', 'true'); // Запоминаем, что пользователь уже был
  };

  // Функция переключения на логин (после регистрации)
  const switchToLogin = () => {
     localStorage.setItem('hasVisited', 'true');
     setView('login');
  }

  // Функция переключения на регистрацию (если нажал "нет аккаунта")
  const switchToRegister = () => {
      setView('register');
  }

  const logout = () => {
    setToken(null);
    setView('login');
  }

  return (
    <div className="container">
      <h1>💧 Water App</h1>
      
      {view === 'register' && (
          <AuthForm 
            mode="register" 
            onSuccess={switchToLogin} 
            onSwitch={switchToLogin} 
          />
      )}
      
      {view === 'login' && (
          <AuthForm 
            mode="login" 
            onSuccess={onLoginSuccess} 
            onSwitch={switchToRegister} 
          />
      )}
      
      {view === 'calculator' && (
          <Calculator onLogout={logout} />
      )}
    </div>
  );
}

// Универсальная форма для Входа и Регистрации
function AuthForm({ mode, onSuccess, onSwitch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isLogin = mode === 'login';
  const endpoint = isLogin ? '/api/login' : '/api/register';
  const title = isLogin ? 'Login' : 'Registration';
  const btnText = isLogin ? 'Sign In' : 'Sign Up';
  const switchText = isLogin ? "Don't have an account? Register" : "Already have an account? Login";

  const handleSubmit = async () => {
    setError('');
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(isLogin ? 'Invalid credentials' : 'Username taken');
      }

      const data = await response.json();
      
      if (isLogin) {
        // Если логин, сервер возвращает токен
        onSuccess(data.token);
      } else {
        // Если регистрация, просто перекидываем на логин
        alert("Registration successful! Please login.");
        onSuccess(); 
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="section">
      <h2>{title}</h2>
      <label>Username</label>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      
      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      
      {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
      
      <button onClick={handleSubmit}>{btnText}</button>
      
      <p 
        style={{textAlign: 'center', color: '#007bff', cursor: 'pointer', marginTop: '15px', textDecoration: 'underline'}} 
        onClick={onSwitch}
      >
        {switchText}
      </p>
    </div>
  );
}

function Calculator({ onLogout }) {
  const [weight, setWeight] = useState('');
  const [isSport, setIsSport] = useState(false);
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            weight: parseFloat(weight), 
            is_sport: isSport 
        }),
      });

      const data = await response.json();
      setResult(data.liters);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="section" style={{border: 'none'}}>
      <h2>Calculator</h2>
      <label>Weight (kg)</label>
      <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
      
      <label className="checkbox-label">
        <input type="checkbox" checked={isSport} onChange={e => setIsSport(e.target.checked)} />
        Do you do sports?
      </label>
      
      <button onClick={handleCalculate} style={{marginTop: '15px'}}>Calculate</button>
      
      {result !== null && (
        <div className="result">
          You need: {result} Liters 🥤
        </div>
      )}

      <button 
        onClick={onLogout} 
        style={{marginTop: '20px', background: '#6c757d'}}
      >
        Logout
      </button>
    </div>
  );
}

export default App;