const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
      // Find all tags and include associated Product data
      const tags = await Tag.findAll({
          include: Product,
      });
      res.json(tags);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});

// Get a single tag by its 'id'
router.get('/:id', async (req, res) => {
  try {
      // Find a single tag by its 'id' and include associated Product data
      const tag = await Tag.findByPk(req.params.id, {
          include: Product,
      });

      if (!tag) {
          return res.status(404).json({ error: 'Tag not found' });
      }

      res.json(tag);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
      // Create a new tag
      const newTag = await Tag.create(req.body);
      res.status(201).json(newTag);
  } catch (err) {
      console.error(err);
      res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
      // Update a tag's name by its 'id' value
      const [rowsAffected] = await Tag.update(req.body, {
          where: {
              id: req.params.id,
          },
      });

      if (rowsAffected === 0) {
          return res.status(404).json({ error: 'Tag not found' });
      }

      res.json({ message: 'Tag updated successfully' });
  } catch (err) {
      console.error(err);
      res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
      // Delete one tag by its 'id' value
      const deletedTag = await Tag.destroy({
          where: { id: req.params.id },
      });

      if (!deletedTag) {
          return res.status(404).json({ error: 'Tag not found' });
      }

      res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;