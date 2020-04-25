import * as Yup from 'yup';

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

    return res.json({ id, title, link, description, tags });
  }

  // eslint-disable-next-line consistent-return
  async index(req, res) {
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
          const { id, title, link, description } = await Tool.findByPk(toolId);

          return { id, title, link, description };
        })
      );
    } else {
      // If we're not seraching by tag
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

    return res.json(wantedToolsWithTags);
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

    return res.status(204).json({ msg: 'Deleted' });
  }
}

export default new ToolController();
