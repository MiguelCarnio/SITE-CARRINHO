import catalog from './blocos.json' with { type: 'json' };

const productGrid = document.createElement('div');
productGrid.id = 'product-grid';
let products = [];

const productTags = ['h2', 'img', 'p', 'span', 'strong'];

const cartElement = document.getElementById('cart');
const cartItemsElement = document.getElementById('cart-items');
const totalElement = document.getElementById('TOTAL');

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let totalPrice = 0;

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function searchProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    const searchTerm = document.getElementById('categoria').value.trim().toLocaleLowerCase();
    const allProducts = Object.values(catalog).flat();

    products = allProducts.filter(product => {
        if (!searchTerm) {
            return true;
        }

        return product
            .filter(value => typeof value === 'string')
            .some(value => value.toLocaleLowerCase().includes(searchTerm));
    });

    if (products.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'Nenhum produto encontrado.';
        productsContainer.appendChild(noResultsMessage);
        return;
    } else {
        productGrid.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('article');
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


            const packSelect = document.createElement('select');
            packSelect.className = 'pack-select';

            const optUnit = document.createElement('option');
            optUnit.value = '1';
            optUnit.textContent = '+1 Unidade';

            const optPack = document.createElement('option');
            optPack.value = '64';
            optPack.textContent = '+1 Pack (64x)';

            packSelect.appendChild(optUnit);
            packSelect.appendChild(optPack);
            productCard.appendChild(packSelect);

            const addToCartButton = document.createElement('button');
            addToCartButton.type = 'button';
            addToCartButton.textContent = 'Adicione ao carrinho';
            addToCartButton.onclick = () => {
                const amountToAdd = parseInt(packSelect.value, 10);
                addToCart(product, amountToAdd);
            };
            productCard.appendChild(addToCartButton);

            productGrid.appendChild(productCard);
        });

        productsContainer.appendChild(productGrid);
    }
}

function addToCart(product, amount = 1) {
    const productName = product[0];
    const productPrice = product[4];

    // Busca se o produto já existe no carrinho
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += amount;
    } else {
        cartItems.push({
            name: productName,
            price: productPrice,
            quantity: amount
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

// Função para formatar a quantidade em Packs e Unidades
function formatQuantity(totalQuantity) {
    if (totalQuantity < 64) {
        return `${totalQuantity}`;
    }

    const packs = Math.floor(totalQuantity / 64);
    const remainder = totalQuantity % 64;

    const packText = packs === 1 ? '1 Pack' : `${packs} Packs`;

    if (remainder > 0) {
        return `${packText} e ${remainder}x`;
    }

    return packText;
}

function renderCart() {
    cartItemsElement.innerHTML = '';
    totalPrice = 0;

    if (cartItems.length === 0) {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'O carrinho está vazio.';
        cartItemsElement.appendChild(emptyCartMessage);
        totalElement.textContent = 'R$ 0.00';
        return;
    }

    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement('article');
        cartItem.className = 'cart-item';

        const quantityElement = document.createElement('span');
        quantityElement.className = 'quantity';
        quantityElement.textContent = formatQuantity(item.quantity);

        const nameElement = document.createElement('strong');
        nameElement.textContent = item.name;

        const priceElement = document.createElement('span');
        priceElement.className = 'price';
        priceElement.textContent = 'R$ ' + (item.price * item.quantity).toFixed(2);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'X';
        removeBtn.onclick = () => removeFromCart(item.name);

        cartItem.appendChild(quantityElement);
        cartItem.appendChild(nameElement);
        cartItem.appendChild(priceElement);
        cartItem.appendChild(removeBtn);

        cartItemsElement.appendChild(cartItem);
    });

    totalElement.textContent = 'R$ ' + totalPrice.toFixed(2);
}

function clearCart() {
    cartItems = [];
    saveCartToLocalStorage();
    renderCart();
}

document.getElementById('categoria').addEventListener('input', searchProducts);

const clearCartBtn = document.getElementById('clear-cart');
clearCartBtn.addEventListener('click', clearCart);

searchProducts();
renderCart();