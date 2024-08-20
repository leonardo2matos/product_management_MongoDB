// Arquivo: /client/js/pagination.js

const productsPerPage = 10;
let currentPage = 1;

function loadProducts(page = 1) {
    const token = localStorage.getItem('token');

    fetch(`${apiBaseUrl}/products?page=${page}&limit=${productsPerPage}`, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    })
        .then(response => response.json())
        .then(data => {
            renderProducts(data.products);
            renderPagination(data.totalPages, page);
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.textContent = i;
        pageLink.classList.add('page-link');
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', () => loadProducts(i));
        paginationContainer.appendChild(pageLink);
    }
}

// Função para carregar produtos na primeira página ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadProducts(currentPage);
});
