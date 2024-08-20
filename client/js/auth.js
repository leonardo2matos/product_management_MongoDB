// Arquivo: /client/js/auth.js

const apiBaseUrl = 'http://localhost:5500';

document.getElementById('loginForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login realizado com sucesso!');
        window.location.href = '../index.html';  // Redireciona para a página principal
    } else {
        alert(`Erro: ${data.message}`);
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${apiBaseUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Usuário registrado com sucesso!');
        window.location.href = 'login.html';  // Redireciona para a página de login
    } else {
        alert(`Erro: ${data.message}`);
    }
});

// Função para verificar autenticação ao carregar a página
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'pages/login.html';  // Redireciona para a página de login se não estiver autenticado
    }
}

checkAuth();  // Chame esta função nas páginas que requerem autenticação
