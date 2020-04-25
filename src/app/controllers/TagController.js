import Tag from '../models/Tag';

class TagController {
  async store(aTag) {
    const tagAlreadyExists = await Tag.findOne({
      where: {
        title: aTag,
      },
    });

    if (tagAlreadyExists) {
      return { id: tagAlreadyExists.id, title: aTag };
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
