const events = require('express').Router();
const db = require('../models');
const { Event } = db;
const { Op } = require('sequelize');

events.get('/', async (req, res) => {
    try {
        const searchTerm = req.query.name ? req.query.name : '';
        const foundEvents = await Event.findAll({
            order: [
                ['date', 'ASC']
            ],
            where: {
                name: {
                    [Op.iLike]: `%${searchTerm}%`
                }
            }
        });
        res.status(200).json(foundEvents);        
    } catch(error) {
        res.status(500).json(error);
    }
});

events.get('/:id', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: {
                event_id: req.params.id
            }
        });
        res.status(200).json(foundEvent);
    } catch(error) {
        res.status(500).json(error);
    }
});

events.post('/', async (req, res) => {
    try {
        const newEvent = await Event.create(req.body);
        res.status(200).json({
            message: 'Successfully created new event',
            data: newEvent
        })
    } catch(error) {
        res.status(500).json(error);
    }
});

events.put('/:id', async (req, res) => {
    try {
        const updatedEvents = await Event.update(req.body, {
            where: {
                event_id: req.params.id
            }
        });
        res.status(200).json({
            message: `Successfully updated ${updatedEvents} event(s)`
        });
    } catch(error) {
        res.status(500).json(error);
    }
});

events.delete('/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.destroy({
            where: {
                event_id: req.params.id
            }
        });
        res.status(200).json({
            message: `Successfully deleted ${deletedEvent} event(s)`
        })
    } catch(error) {
        res.status(500).json(error);
    }
});

module.exports = events;