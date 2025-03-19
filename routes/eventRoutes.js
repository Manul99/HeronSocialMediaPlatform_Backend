const express = require('express');
const { createEvents, updateEvents, getEventsById, getAllEvents, deleteEvent } = require('../controllers/EventsControllers');
const router = express.Router();

router.post('/',createEvents);
router.put('/:id',updateEvents);
router.get('/:eventId',getEventsById);
router.get('/',getAllEvents);
router.delete('/:eventId', deleteEvent);


module.exports = router;