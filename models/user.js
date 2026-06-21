const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['Buyer', 'Seller'], required: true },
    profilePhoto: { type: String, required: true }, // Will store secure cloudinary URL
    identityCard: { type: String, required: true },
     savedProperties: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plot"
      }
    ],
    default: []
  }

}, { timestamps: true });
   

module.exports= mongoose.model('User', userSchema);
