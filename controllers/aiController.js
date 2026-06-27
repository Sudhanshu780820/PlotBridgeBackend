const Plot = require("../models/Plot");
const { extractFilters } = require("../services/aiService");

const searchProperties = async (req, res) => {
    // Keep your existing code
};

const compareProperties = async (req, res) => {
    // Keep your existing code
};

const chatAI = async (req, res) => {
    try {
        const { message } = req.body;

        const filters = await extractFilters(message);

        let query = {
            status: "Available"
        };

        if (filters.city) {
            query.location = {
                $regex: filters.city,
                $options: "i"
            };
        }

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.budget) {
            query.price = {
                $lte: filters.budget
            };
        }

        if (filters.minArea || filters.maxArea) {
            query.size = {};

            if (filters.minArea)
                query.size.$gte = filters.minArea;

            if (filters.maxArea)
                query.size.$lte = filters.maxArea;
        }

        const properties = await Plot.find(query).limit(5);

        if (properties.length === 0) {
            return res.json({
                reply: "Sorry, I couldn't find any matching properties.",
                properties: []
            });
        }

        res.json({
            reply: `I found ${properties.length} matching properties.`,
            properties
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            reply: "Something went wrong."
        });

    }
};

module.exports = {
    searchProperties,
    compareProperties,
    chatAI
};