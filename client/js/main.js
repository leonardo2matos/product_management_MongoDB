// Arquivo: scripts.js

const apiBaseUrl = 'http://localhost:5500/products';

// Carregar todos os produtos ao iniciar
document.addEventListener('DOMContentLoaded', loadProducts);

// Função para carregar todos os produtos
function loadProducts() {
    fetch(`${apiBaseUrl}?page=1&limit=10`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Processar dados de produtos
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

// Renderizar os produtos na tabela
function renderProducts(products) {
    const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    productsTable.innerHTML = ''; // Limpa a tabela

    products.forEach(product => {
        const row = productsTable.insertRow();

        row.insertCell(0).textContent = product.name;
        row.insertCell(1).textContent = product.price;
        row.insertCell(2).textContent = product.model;
        row.insertCell(3).textContent = product.brand;
        row.insertCell(4).textContent = product.rating || 'N/A';

        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = `
            <a href="#" onclick="editProduct('${product._id}')">Editar</a> |
            <a href="#" onclick="deleteProduct('${product._id}')">Excluir</a>
        `;
    });
}

// Adicionar ou atualizar produto
document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const id = document.getElementById('productId').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const model = document.getElementById('model').value;
    const brand = document.getElementById('brand').value;
    const pictures = document.getElementById('pictures').value.split(',').map(url => url.trim());
    const rating = document.getElementById('rating').value;

    const product = {
        name,
        price,
        model,
        brand,
        pictures,
        rating
    };

    if (id) {
        updateProduct(id, product);
    } else {
        addProduct(product);
    }
});

// Função para adicionar um novo produto
function addProduct(product) {
    fetch(apiBaseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(data => {
            alert('Produto adicionado com sucesso!');
            loadProducts();
            clearForm();
        })
        .catch(error => console.error('Erro ao adicionar produto:', error));
}

// Função para editar um produto
function editProduct(id) {
    fetch(`${apiBaseUrl}/${id}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('productId').value = product._id;
            document.getElementById('name').value = product.name;
            document.getElementById('price').value = product.price;
            document.getElementById('model').value = product.model;
            document.getElementById('brand').value = product.brand;
            document.getElementById('pictures').value = product.pictures.join(', ');
            document.getElementById('rating').value = product.rating;
            document.getElementById('submitButton').textContent = 'Atualizar Produto';
        })
        .catch(error => console.error('Erro ao editar produto:', error));
}

// Função para atualizar um produto
function updateProduct(id, product) {
    fetch(`${apiBaseUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(data => {
            alert('Produto atualizado com sucesso!');
            loadProducts();
            clearForm();
        })
        .catch(error => console.error('Erro ao atualizar produto:', error));
}

// Função para excluir um produto
function deleteProduct(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        fetch(`${apiBaseUrl}/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                alert('Produto excluído com sucesso!');
                loadProducts();
            })
            .catch(error => console.error('Erro ao excluir produto:', error));
    }
}

// Limpar o formulário após adicionar ou atualizar
function clearForm() {
    document.getElementById('productId').value = '';
    document.getElementById('productForm').reset();
    document.getElementById('submitButton').textContent = 'Adicionar Produto';
}
// Função para aplicar filtros
function applyFilters() {
    const brand = document.getElementById('filterBrand').value;
    const price = document.getElementById('filterPrice').value;

    let url = apiBaseUrl;

    if (brand) {
        if (price) {
            url += `/brand/${brand}/price/greater-than/${price}`;
        } else {
            url += `/brand/${brand}`;
        }
    } else if (price) {
        url += `/price/greater-than/${price}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => renderProducts(data))
        .catch(error => console.error('Erro ao aplicar filtros:', error));
}
