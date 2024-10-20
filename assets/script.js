let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showModal() { 
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 1500); 
}

function addToCart(product) { 
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); 
    showModal(); 
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

function displayCart() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    if (!cartTableBody) {
        return; 
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartTableBody.innerHTML = '';

    cart.forEach(product => {
        const totalPrice = (product.price * product.quantity).toFixed(2);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price} €</td>
            <td>
                <button class="quantity-btn" data-id="${product.id}" data-action="decrease">-</button>
                ${product.quantity}
                <button class="quantity-btn" data-id="${product.id}" data-action="increase">+</button>
            </td>
            <td>${totalPrice} €</td>
            <td><button class="remove-btn" data-id="${product.id}">Poista</button></td>
        `;
        
        cartTableBody.appendChild(row);
    });

    
    updateCartTotal();
    addCartEventListeners();
}

function addCartEventListeners() {
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');

    quantityButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            const action = event.target.dataset.action;
            updateProductQuantity(productId, action);
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            removeProductFromCart(productId);
        });
    });
}

function updateProductQuantity(productId, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === productId);

    if (product) {
        if (action === 'increase') {
            product.quantity += 1;
        } else if (action === 'decrease') {
            if (product.quantity > 1) {
                product.quantity -= 1;
            } else {
                
                cart = cart.filter(item => item.id !== productId);
            }
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); 
    updateCartCount(); 
    updateCartTotal(); 
}

function removeProductFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(); 
    updateCartCount(); 
    updateCartTotal(); 
}

function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2);

    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.innerHTML = `Ostosten loppusumma: ${total} €`;
    }
}

function clearCart() {
    
    localStorage.removeItem('cart');
    displayCart(); 
    updateCartCount();
    updateCartTotal();
}

function showThankYouModal() {
    const thankYouModal = document.getElementById('thankYouModal');
    if (thankYouModal) {
        thankYouModal.style.display = 'flex'; 
        setTimeout(() => {
            thankYouModal.style.display = 'none'; 
        }, 3000); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    const clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    } 
    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            clearCart(); 
            showThankYouModal(); 
        });
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product');
            const product = {
                id: productElement.dataset.id,
                name: productElement.querySelector('h3').textContent,
                price: productElement.querySelector('p:nth-of-type(2)').textContent.match(/[\d,.]+/)[0]
            };
            addToCart(product); 
        });
    });

    updateCartCount(); 
    displayCart(); 
    updateCartTotal();
});
