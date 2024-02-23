const express = require('express');
const fs = require('fs');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const app = express();
const PORT = 8080;

const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    let products = await productManager.getProducts();

    if (limit) {
      products = products.slice(0, limit);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get un producto por id
productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// nuevo producto 
productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// actualizar un producto por id
productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    await productManager.updateProduct(productId, updatedProduct);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// eliminar producto por id
productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await productManager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


const cartsRouter = express.Router();

// nuevo carrito 
cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = req.body;
    await cartManager.addCart(newCart);
    res.status(201).json({ message: 'Cart created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// listar prods de un carrito por id
cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// sgregar por id al carrito

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    await cartManager.addProductToCart(cartId, productId, quantity);
    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});