import Tooltag from '../models/Tooltag';
import Tag from '../models/Tag';

class TooltagServices {
  async fetchTagNamesBelongTool(toolId) {
    const tooltags = await Tooltag.findAll({
      where: { toolid: toolId },
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
}

export default new TooltagServices();
