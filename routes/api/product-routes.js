const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
    try {
        // Find all products and include associated Category and Tag data
        const products = await Product.findAll({
            include: [
                { model: Category },
                { model: Tag, through: ProductTag }
            ]
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a single product by its 'id'
router.get('/:id', async (req, res) => {
    try {
        // Find a single product by its 'id' and include associated Category and Tag data
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category },
                { model: Tag, through: ProductTag }
            ]
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', (req, res) => {
    /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    Product.create(req.body).then((product) => {
        if (req.body.tagIds.length) {
            const productTagIdArr = req.body.tagIds.map((tag_id) => {
                return {
                    product_id: product.id,
                    tag_id,
                };
            });
            return ProductTag.bulkCreate(productTagIdArr);
        }
        res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
        console.log(err);
        res.status(400).json(err);
    })
});

router.put('/:id', (req, res) => {
    // update product data
    Product.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
    .then((product) => {
        if (req.body.tagIds && req.body.tagIds.length) {

            ProductTag.findAll({
                where: { product_id: req.params.id }
            }).then((productTags) => {
                const productTagIds = productTags.map(({ tag_id }) => tag_id);
                const newProductTags = req.body.tagIds
                    .filter((tag_id) => !productTagIds.includes(tag_id))
                    .map((tag_id) => {
                        return {
                            product_id: req.params.id,
                            tag_id,
                        };
                    });

                const productTagsToRemove = productTags
                .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                .map(({ id }) => id);
                // run both actions
                return Promise.all([
                    ProductTag.destroy({ where: { id: productTagsToRemove } }),
                    ProductTag.bulkCreate(newProductTags),
                ]);
            });
        }
        return res.json(product);
    })
        .catch((err) => {
            // console.log(err);
            res.status(400).json(err);
        })
});

router.delete('/:id', async (req, res) => {
    try {
        // Delete one product by its 'id' value
        const deletedProduct = await Product.destroy({
            where: { id: req.params.id },
        });

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;