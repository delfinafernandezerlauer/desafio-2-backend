const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.initializeCarts();
    }

    initializeCarts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            this.carts = JSON.parse(data);
            
        } catch (error) {
            this.carts = [];
        }
    }

    addCart(cart) {
        if (!cart.id || !cart.products) {
            throw new Error("ID y productos son requeridos para un nuevo carrito");
        }

        // chequeo existencia de cart
        const existingCart = this.carts.find(existingCart => existingCart.id === cart.id);
        if (existingCart) {
            throw new Error("A cart with the same ID already exists");
        }

        this.carts.push(cart);
        this.saveCarts(carts);
    }

    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    getCarts() {
        return this.carts;
    }

    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        const existingProductIndex = cart.products.findIndex(product => product.id === productId);

        if (existingProductIndex !== -1) {
            // producto existe
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // nuevo producto en el cart
            cart.products.push({ id: productId, quantity });
        }

        this.saveCarts();
    }

    saveCarts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
    }
}

module.exports = CartManager;
