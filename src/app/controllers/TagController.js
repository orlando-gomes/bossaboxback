import Tag from '../models/Tag';

class TagController {
  async store(aTag) {
    if (!aTag) {
      return null;
    }

    const tagExists = await Tag.findOne({
      where: {
        title: aTag,
      },
    });

    if (tagExists) {
      return { id: tagExists.id, title: aTag };
    }

    const { id, title } = await Tag.create({ title: aTag });

    return { id, title };
  }

  async index(req, res) {
    const tags = await Tag.findAll({
      attributes: ['id', 'title'],
    });

    return res.json(tags);
  }

  async show(req, res) {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { id, title } = tag;

    return res.json({ id, title });
  }
}

export default new TagController();
