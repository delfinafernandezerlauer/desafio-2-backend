const express = require('express');
const ProductManager = require('./ProductManager'); 

const app = express();
const PORT = 3000;

const productManager = new ProductManager(); 

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit; 
    let products = await productManager.getProducts(); 

    if (limit) {
      products = products.slice(0, limit); 
    }

    res.json(products); // rta: los productos
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); // Obtener el pid de los parámetros de la solicitud
    const product = await productManager.getProductById(productId); // Obtener el producto por ID

    if (product) {
      res.json(product); // Devolver el producto como respuesta si se encuentra
    } else {
      res.status(404).json({ error: 'Product not found' }); // Devolver un error si el producto no se encuentra
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
