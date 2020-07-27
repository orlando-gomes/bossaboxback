import Tooltag from '../models/Tooltag';
import Tag from '../models/Tag';

class TooltagServices {
  async fetchTagNamesBelongingATool(toolid) {
    const tooltags = await Tooltag.findAll({
      where: { toolid },
      attributes: [],
      include: [
        {
          model: Tag,
          as: 'tag',
          attributes: ['title'],
        },
      ],
    });

    return tooltags.map(tooltag => tooltag.tag.title);
  }

  arrayIdsOfToolsThatHaveTag(tagid) {
    const tooltags = Tooltag.findAll({
      where: { tagid },
      attributes: ['toolid'],
    });

    const arrayOfTools = tooltags.map(tooltag => tooltag.toolid);

    return arrayOfTools;
  }

  async purgeTagTable() {
    const tags = await Tag.findAll({
      attributes: ['id', 'title'],
    });

    Promise.all(
      tags.forEach(async tag => {
        const tg = await Tooltag.findOne({
          where: { tagid: tag.id },
        });

        if (!tg) {
          tag.destroy();
        }
      })
    );
  }
}

export default new TooltagServices();
