import Tag from '../models/Tag';

class TagController {
  async store(aTag) {
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
}

export default new TagController();
