const Trip = require('../models/Trip');
const { google } = require('googleapis');

exports.createTrip = async (req, res) => {
    try {
        const { destination, currentLocation } = req.body;
        
        // Créer un nouveau trajet
        const trip = new Trip({
            userId: req.user._id,
            destination,
            currentLocation
        });

        // Calculer l'estimation de temps d'arrivée avec l'API Google Maps
        const directionsService = google.maps({
            version: 'beta',
            key: process.env.GOOGLE_MAPS_API_KEY
        });

        const response = await directionsService.directions({
            origin: `${currentLocation.latitude},${currentLocation.longitude}`,
            destination: `${destination.latitude},${destination.longitude}`,
            travelMode: 'DRIVING'
        });

        if (response.data.routes.length > 0) {
            const duration = response.data.routes[0].legs[0].duration.value; // en secondes
            trip.estimatedArrivalTime = new Date(Date.now() + duration * 1000);
        }

        await trip.save();
        res.status(201).json({ trip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { tripId, currentLocation } = req.body;
        const trip = await Trip.findByIdAndUpdate(
            tripId,
            { currentLocation },
            { new: true }
        );
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.json({ trip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.endTrip = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findByIdAndUpdate(
            tripId,
            { status: 'completed' },
            { new: true }
        );
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.json({ trip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
