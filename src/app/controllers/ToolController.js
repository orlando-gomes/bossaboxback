import * as Yup from 'yup';
import myCache from '../services/cache';

import Tool from '../models/Tool';
import Tag from '../models/Tag';
import TagController from './TagController';
import Tooltag from '../models/Tooltag';
import TooltagServices from '../services/TooltagServices';

class ToolController {
  // eslint-disable-next-line consistent-return
  async store(req, res) {
    const schemaFieldsRequired = Yup.object().shape({
      title: Yup.string()
        .required()
        .min(2),
      link: Yup.string().required(),
      description: Yup.string()
        .required()
        .min(2),
    });

    if (!(await schemaFieldsRequired.isValid(req.body))) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const schemaLink = Yup.object().shape({
      link: Yup.string()
        .required()
        .url(),
    });

    if (!(await schemaLink.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid url' });
    }

    const schemaTags = Yup.object().shape({
      tags: Yup.array()
        .required()
        .min(1),
    });

    if (!(await schemaTags.isValid(req.body))) {
      return res.status(400).json({ error: 'At least one tag is required' });
    }

    try {
      const linkExists = await Tool.findOne({
        where: {
          link: req.body.link,
        },
      });

      if (linkExists) {
        return res.status(400).json({ error: 'Link has been already used' });
      }

      const { id, title, link, description } = await Tool.create(req.body);

      const tagsSaved = await Promise.all(
        req.body.tags.map(async tagName => {
          const tagSaved = await TagController.store(tagName.toLowerCase());
          return { id: tagSaved.id, title: tagSaved.title };
        })
      );

      // Creating relationship in Toolags table
      const tags = await Promise.all(
        tagsSaved.map(tagSaved => {
          if (tagSaved.id) {
            Tooltag.create({
              toolid: id,
              tagid: tagSaved.id,
            });
            return tagSaved.title;
          }
          return false;
        })
      );

      myCache.del('allTools');

      return res.json({ id, title, link, description, tags });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // eslint-disable-next-line consistent-return
  async index(req, res) {
    // console.log('busca de ferramentas - NODE_ENV=development!!!');
    // setTimeout(async () => {
    // ////////////////////////////////////

    try {
      let wantedTools = [];

      const searchingByTag = req.query.tag;

      if (searchingByTag) {
        const tagExists = await Tag.findOne({
          where: {
            title: searchingByTag.toLowerCase(),
          },
        });
        if (!tagExists) {
          return res.json([]);
        }

        const arrayOfToolsIds = await TooltagServices.arrayIdsOfToolsThatHaveTag(
          tagExists.id
        );

        wantedTools = await Promise.all(
          arrayOfToolsIds.map(async toolId => {
            const { id, title, link, description } = await Tool.findByPk(
              toolId
            );

            return { id, title, link, description };
          })
        );
      } else {
        // If we're not searching by tag
        const fetchToolsFromCache = myCache.get('allTools');
        if (fetchToolsFromCache !== undefined) {
          // console.log('Sending from cache');
          return res.json(fetchToolsFromCache);
        }

        wantedTools = await Tool.findAll({
          attributes: ['id', 'title', 'link', 'description'],
        });
      }

      const wantedToolsWithTags = await Promise.all(
        wantedTools.map(async tool => {
          const { id, title, link, description } = tool;

          const tags = await TooltagServices.fetchTagNamesBelongingATool(id);
          return { id, title, link, description, tags };
        })
      );

      // Caching only complete searchs
      if (!searchingByTag) {
        // console.log('Caching');
        myCache.set('allTools', wantedToolsWithTags, 60 * 5);
      }

      return res.json(wantedToolsWithTags);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    // ////////////////////////////////////
    // }, 3000);
  }

  async show(req, res) {
    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { id, title, link, description } = tool;

    const tags = await TooltagServices.fetchTagNamesBelongingATool(id);

    return res.json({ id, title, link, description, tags });
  }

  async delete(req, res) {
    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    tool.destroy();

    await TooltagServices.purgeTagTable();

    myCache.del('allTools');

    return res.status(204).json({ msg: 'Deleted' });
  }
}

export default new ToolController();
