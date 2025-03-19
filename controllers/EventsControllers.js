const asyncHandler = require('express-async-handler');
const Events = require('../models/Events');
const Clubs = require('../models/Clubs');


const createEvents = asyncHandler(async (req, res) => {
             
    try {
        const{clubId,name,description,date,time,location,responsibleUserId,isPublic,eligibilityCriteria,participants,discussions,annoucements} =  req.body;

        if(!clubId || !name || !description || !date || !time || !location || !responsibleUserId || !isPublic || !eligibilityCriteria){
            res.status(400);
            throw new Error("Please fill all the fields");
        };

        // ✅ Check if club exists
    const clubExists = await Clubs.findById(clubId);
    if (!clubExists) {
      return res.status(404).json({ message: "Club not found" });
    }


        const newEvent = new Events({
            clubId: clubId || null,
            name,
            description,
            date,
            time,
            location,
            participants: participants || [],
            isPublic: isPublic ?? false,
            responsibleUserId,
            eligibilityCriteria,
            discussions: discussions || [],  
            annoucements: annoucements || [] 
        });

        await newEvent.save();

        if(clubId){
            await Clubs.findByIdAndUpdate(clubId, {$push: {events: newEvent._id}});
        }

        res.status(201).json({ message: 'Events created successfully', newEvent });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//Update Events
const updateEvents = asyncHandler(async (req, res) => {
   try {
        const { id } = req.params;
        const { clubId, name, description, date, time, location, participants, isPublic, eligibilityCriteria, discussions, annoucements,responsibleUserId } = req.body;

        const eventId = req.params.id;
        const event = await Events.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

         // Update the event fields
         event.clubId = clubId || event.clubId;
         event.name = name || event.name;
         event.description = description || event.description;
         event.date = date || event.date;
         event.time = time || event.time;
         event.location = location || event.location;
         event.responsibleUserId = responsibleUserId || event.responsibleUserId;
         event.isPublic = isPublic ?? event.isPublic;
         event.eligibilityCriteria = eligibilityCriteria || event.eligibilityCriteria;
         event.participants = participants || event.participants;
         event.discussions = discussions || event.discussions;
         event.annoucements = annoucements || event.annoucements;

        const updateEvent = await event.save();
        res.status(200).json({ message: 'Event updated successfully', updateEvent });
   } catch (error) {
        console.error("Failed to update data",error);
        res.status(500).json({error: error.message});
   }
});

//Get Event By Id
const getEventsById = asyncHandler(async (req, res) => {
    try {
        const {eventId} = req.params;

        // Find event by ID
        const event = await Events.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// This  returns all events, possibly for a specific club
const getAllEvents = asyncHandler(async (req, res) => {
    try {
        const { clubId } = req.query;  // Corrected this line

        let events;
        if (clubId) {
            events = await Events.find({ clubId });  // Find events by clubId
        } else {
            events = await Events.find();  // Get all events
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Delete
const deleteEvent = asyncHandler(async (req, res) => {
    try {
        const {eventId} = req.params;

        
        const event = await Events.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        
        if (event.clubId) {
            await Clubs.findByIdAndUpdate(event.clubId, { $pull: { events: eventId } });
        }

      
        await event.deleteOne();

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = {createEvents,updateEvents,getEventsById,getAllEvents,deleteEvent};