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

        products.push(product);
        this.saveProducts(products);
    }

    getProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    getProductById(id) {
        const products = this.getProducts();
        return products.find(product => product.id === id);
    }

    updateProduct(id, updatedProduct) {
        let products = this.getProducts();
        const index = products.findIndex(product => product.id === id);
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

            products[index] = { ...products[index], ...updatedProduct };
            this.saveProducts(products);
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(product => product.id !== id);
        this.saveProducts(products);
    }

    saveProducts(products) {
        fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductManager;
