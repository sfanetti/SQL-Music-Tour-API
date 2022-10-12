const bands = require('express').Router();
const db = require('../models');
const { Band, MeetGreet, Event, SetTime } = db;
const { Op } = require('sequelize');

bands.get('/', async (req, res) => {
    try {
        const searchTerm = req.query.name ? req.query.name : '';
        const foundBands = await Band.findAll({
            order: [
                ['available_start_time', 'ASC']
            ],
            where: {
                name: {
                    [Op.iLike]: `%${searchTerm}%`
                }
            }
        });
        res.status(200).json(foundBands);        
    } catch(error) {
        res.status(500).json(error);
    }
});

bands.get('/:name', async (req, res) => {
    try {
        const searchTerm = req.query.event ? req.query.event : '';
        const foundBand = await Band.findOne({
            where: {
                name: req.params.name
            },
            include: [
                {
                    model: MeetGreet,
                    as: 'meet_greets',
                    include: {
                        model: Event,
                        as: 'event',
                        where: {
                            name: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        }
                    }
                },
                { 
                    model: SetTime,
                    as: 'set_times',
                    include: {
                        model: Event,
                        as: 'event',
                        where: {
                            name: {
                                [Op.iLike]: `%${searchTerm}%`
                            }
                        }
                    }
                }
            ]
        });
        res.status(200).json(foundBand);
    } catch(error) {
        res.status(500).json(error);
    }
});

bands.post('/', async (req, res) => {
    try {
        const newBand = await Band.create(req.body);
        res.status(200).json({
            message: 'Successfully created new band',
            data: newBand
        })
    } catch(error) {
        res.status(500).json(error);
    }
});

bands.put('/:id', async (req, res) => {
    try {
        const updatedBands = await Band.update(req.body, {
            where: {
                band_id: req.params.id
            }
        });
        res.status(200).json({
            message: `Successfully updated ${updatedBands} bands(s)`
        });
    } catch(error) {
        res.status(500).json(error);
    }
});

bands.delete('/:id', async (req, res) => {
    try {
        const deletedBand = await Band.destroy({
            where: {
                band_id: req.params.id
            }
        });
        res.status(200).json({
            message: `Successfully deleted ${deletedBand} band(s)`
        })
    } catch(error) {
        res.status(500).json(error);
    }
});

module.exports = bands;