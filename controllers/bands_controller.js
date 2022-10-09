const bands = require('express').Router();
const db = require('../models');
const { Band } = db;
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

bands.get('/:id', async (req, res) => {
    try {
        const foundBand = await Band.findOne({
            where: {
                band_id: req.params.id
            }
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