import catalog from './dados.json' with { type: 'json' };

const productGrid = document.createElement('div');
productGrid.id = 'product-grid';
let products = [];

const productTags = ['h2', 'img', 'p', 'span', 'strong'];

// Elementos do DOM
const cartElement = document.getElementById('cart');
const totalElement = document.getElementById('total');

// Estado do Carrinho (Recupera do LocalStorage se existir)
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let totalPrice = 0;

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function searchProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    const selectedCategory = document.getElementById('categoria').value;

    if (Object.hasOwn(catalog, selectedCategory)) {
        products = catalog[selectedCategory];
    } else if (selectedCategory === '') {
        products = Object.values(catalog).flat(1);
    } else {
        alert('Categoria inválida. Por favor, selecione uma categoria válida: smartphones, eletrodomesticos, notebooks, perifericos, audio_e_video');
        return;
    }

    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        product.forEach((value, index) => {
            const tagName = productTags[index] || 'p';
            const productElement = document.createElement(tagName);
        
            if (tagName === 'img') {
                productElement.src = value;
                productElement.alt = `Imagem do produto: ${product[0]}`;
            } else if (tagName === 'strong') {
                productElement.textContent = 'R$ ' + value.toFixed(2);
            } else {
                productElement.textContent = value;
            }
            
            productCard.appendChild(productElement);
        });

        const addToCartButton = document.createElement('button');
        addToCartButton.innerHTML = 'Adicione ao carrinho';
        addToCartButton.onclick = () => addToCart(product);
        productCard.appendChild(addToCartButton);

        productGrid.appendChild(productCard);
    });

    productsContainer.appendChild(productGrid);
}

function addToCart(product) {
    const productName = product[0];
    const productPrice = product[4];
    
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    saveCartToLocalStorage();
    renderCart();
}

function removeFromCart(productName) {
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
        } else {
            cartItems = cartItems.filter(item => item.name !== productName);
        }
    }

    saveCartToLocalStorage();
    renderCart();
}

function renderCart() {
    cartElement.innerHTML = '';
    totalPrice = 0;

    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const quantityElement = document.createElement('h3');
        quantityElement.className = 'quantity';
        quantityElement.textContent = item.quantity;

        const nameElement = document.createElement('h2');
        nameElement.textContent = item.name;

        const priceElement = document.createElement('h2');
        priceElement.className = 'price';
        priceElement.textContent = 'R$ ' + (item.price * item.quantity).toFixed(2);


        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '❌';
        removeBtn.onclick = () => removeFromCart(item.name);

        cartItem.appendChild(quantityElement);
        cartItem.appendChild(nameElement);
        cartItem.appendChild(priceElement);
        cartItem.appendChild(removeBtn);

        cartElement.appendChild(cartItem);
    });

    totalElement.textContent = 'R$ ' + totalPrice.toFixed(2);
}

// Listeners e Inicialização
document.getElementById('pesquisar').addEventListener('click', searchProducts);

searchProducts();
renderCart();