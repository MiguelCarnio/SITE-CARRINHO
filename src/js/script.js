import catalog from './dados.json' with { type: 'json' };

const productGrid = document.createElement('div');
productGrid.id = 'product-grid';
let products = '';

const productTags = ['h2', 'img', 'p', 'span', 'strong'];

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
            } else {
                productElement.textContent = value;
            }

            if (tagName === 'strong') {
                productElement.textContent = 'R$ ' + value.toFixed(2);
            }
            productCard.appendChild(productElement);
        });

        const addToCartButton = document.createElement('button');
        addToCartButton.innerHTML = 'adicione ao carrinho';
        addToCartButton.onclick = () => addToCart(product);
        productCard.appendChild(addToCartButton);

        productGrid.appendChild(productCard);
    });

    productsContainer.appendChild(productGrid);
}

document.getElementById('pesquisar').addEventListener('click', searchProducts);

const cartItems = [];
let totalPrice = 0;
const totalElement = document.getElementById('total');

const cartElement = document.getElementById('cart');

function addToCart(product) {
    const productName = product[0];
    const productPrice = product[4];
    
    totalPrice += productPrice;
    totalElement.textContent = 'R$ ' + totalPrice.toFixed(2);
    
    const existingItem = cartItems.find(item => item[0] === productName);

    if (existingItem) {
        existingItem[2] += 1;
        const cartItemsOnScreen = cartElement.getElementsByClassName('cart-item');
        
        for (const cartItem of cartItemsOnScreen) {
            const nameElement = cartItem.querySelector('h2');
            if (nameElement.textContent === productName) {
                const quantityElement = cartItem.querySelector('h3');
                quantityElement.textContent = existingItem[2];
                break;
            }
        }
    } else {
        cartItems.push([productName, productPrice, 1]);

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const nameElement = document.createElement('h2');
        const priceElement = document.createElement('h2');
        const quantityElement = document.createElement('h3');
        priceElement.className = 'price';
        quantityElement.className = 'quantity';
        nameElement.textContent = productName;
        priceElement.textContent = 'R$ ' + productPrice.toFixed(2);
        quantityElement.textContent = 1;
        cartItem.appendChild(quantityElement);
        cartItem.appendChild(nameElement);
        
        cartItem.appendChild(priceElement);
        cartElement.appendChild(cartItem);
    }
}

searchProducts();