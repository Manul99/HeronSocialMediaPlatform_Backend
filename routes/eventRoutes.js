const express = require('express');
const { createEvents, updateEvents, getEventsById, getAllEvents, deleteEvent } = require('../controllers/EventsControllers');
const router = express.Router();
const multer = require('multer');

const storage1 = multer.memoryStorage();
const upload1 = multer({storage:storage1});

router.post('/', upload1.single("media"),createEvents);
router.put('/:id',updateEvents);
router.get('/:eventId',getEventsById);
router.get('/getevent',getAllEvents);
router.delete('/:eventId', deleteEvent);


module.exports = router;