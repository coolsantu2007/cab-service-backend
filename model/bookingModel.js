const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
mongoose.set('strictQuery', true);

const bookingSchema = new Schema({
  createdDate: { 
    type: Date, 
    default: Date.now 
  },

  updatedDate: { 
    type: Date, 
    default: Date.now 
  },

  Customer_name: {
    type: String,
    default: ""
  },

  Customer_mobile: {
    type: String,
    default: ""
  },

  Pickup_address: {
    type: String,
    default: ""
  },

  Drop_address: {
    type: String,
    default: ""
  },

  Travel_date: {
    type: String,
    default: ""
  },

  Pickup_time: {
    type: String,
    default: ""
  },

  Favourite_car: {
    type: String,
    default: ""
  },

  Status: {
    type: String,
    default: "Booking Requested"
  },

  Cancellation_reason: {
    type: String,
    default: ""
  },

  Driver_name: {
    type: String,
    default: ""
  },

  Driver_mobile: {
    type: String,
    default: ""
  },

  Estimated_fare: {
    type: Number,
    default: 0
  },

  Booking_id: {
    type: String,
    default: ""
  },

});

bookingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("booking_details", bookingSchema);