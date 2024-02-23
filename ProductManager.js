const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.initializeProducts();
    }

    initializeProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    addProduct(product) {
        // valido campos obligatorios
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error("Todos los campos son obligatorios");
        }

        // valido precio y stock positivos
        if (typeof product.price !== 'number' || product.price <= 0 || typeof product.stock !== 'number' || product.stock < 0) {
            throw new Error("El precio y el stock deben ser números positivos");
        }

        // valido no repetir code
        const products = this.getProducts();
        if (products.some(existingProduct => existingProduct.code === product.code)) {
            throw new Error("Ya existe un producto con ese código");
        }

        product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        this.products.push(product);
        this.saveProducts(products);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);

        if (index !== -1) {
    
            if (!updatedProduct.title || !updatedProduct.description || !updatedProduct.price || !updatedProduct.thumbnail || !updatedProduct.code || !updatedProduct.stock) {
                throw new Error("Todos los campos son obligatorios");
            }

            if (typeof updatedProduct.price !== 'number' || updatedProduct.price <= 0 || typeof updatedProduct.stock !== 'number' || updatedProduct.stock < 0) {
                throw new Error("El precio y el stock deben ser números positivos");
            }

            if (updatedProduct.code !== products[index].code && products.some(existingProduct => existingProduct.code === updatedProduct.code)) {
                throw new Error("Ya existe un producto con ese código");
            }

            
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.saveProducts();
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
        this.saveProducts();
    }

    saveProducts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    }
}

module.exports = ProductManager;
