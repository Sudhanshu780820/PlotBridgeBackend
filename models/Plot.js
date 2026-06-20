const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: '₹ Rupees' },
  category: { type: String, default: 'Residential' },
  size: { type: Number, required: true },
  unit: { type: String, default: 'Sq. Ft.' },
  location: { type: String, required: true },
  description: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  images: [{ type: String }],
  seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This must exactly match the name of your User model!
      required: true,
    },
    // ---------------------------------

    status: { 
      type: String, 
      enum: ["Active", "Sold", "Pending"], 
      default: "Active" 
    },
    views: { 
      type: Number, 
      default: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('Plot', plotSchema);