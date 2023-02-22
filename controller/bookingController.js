const bookingModel = require('../model/bookingModel');
const Helper = require('../configuration/helper');
const { default: mongoose } = require('mongoose');

module.exports = {
    generateBookingRequest: async (req, res) => {
        try {
            const { customer_name, customer_mobile, pickup_address, drop_address, travel_date, pickup_time, car_type } = req.body

            let bookingId = 'BID' + Helper.generateRandNo()
                const bookCab = new bookingModel({
                    Customer_name: customer_name,
                    Customer_mobile: customer_mobile,
                    Pickup_address: pickup_address,
                    Drop_address: drop_address,
                    Travel_date: travel_date,
                    Pickup_time: pickup_time,
                    Favourite_car: car_type,
                    Booking_id: bookingId
                })
                bookCab.save()

                if (bookCab) {
                    return Helper.response(res, 200, "Success", "Cab booking request sent successfully");
                }else{
                    return Helper.response(res, 200, "Error", "Something went wrong, please try again");
                }
        } catch (error) {
            console.log(error)
            return Helper.response(res, 500, error.message);
        }
    },

    updateBookingStatus: async (req, res) => {
        try {
            const { booking_id, new_status, driver_name, driver_mobile, estimated_fare, cancellation_reason } = req.body

            if (new_status == "Confirm") {
                const checkBookingId = await bookingModel.findOne({ _id: mongoose.Types.ObjectId(booking_id) })
                if (checkBookingId) {
                    const updateBookingStatus = await bookingModel.updateOne({ _id: mongoose.Types.ObjectId(checkBookingId._id) }, {
                        $set: {
                            Status: "Booking Confirmed",
                            Driver_name: driver_name,
                            Driver_mobile: driver_mobile,
                            Estimated_fare: estimated_fare,
                            updatedDate: new Date()
                        }
                    })
                    if (updateBookingStatus.modifiedCount == 1 || updateBookingStatus.modifiedCount == 0) {
                        return Helper.response(res, 200, "Success", "Booking confirmed successfully");
                    } else {
                        return Helper.response(res, 200, "Error", "Something went wrong, please try again");
                    }
                } else {
                    return Helper.response(res, 200, "Error", "Booking id doesn't exists");
                }
            } else if (new_status == "Cancel") {
                const checkBookingId = await bookingModel.findOne({ _id: mongoose.Types.ObjectId(booking_id) })
                if (checkBookingId) {
                    const updateBookingStatus = await bookingModel.updateOne({ _id: mongoose.Types.ObjectId(checkBookingId._id) }, {
                        $set: {
                            Status: "Booking Cancelled",
                            Cancellation_reason: cancellation_reason,
                            updatedDate: new Date()
                        }
                    })
                    if (updateBookingStatus.modifiedCount == 1 || updateBookingStatus.modifiedCount == 0) {
                        return Helper.response(res, 200, "Success", "Booking cancelled successfully");
                    } else {
                        return Helper.response(res, 200, "Error", "Something went wrong, please try again");
                    }
                } else {
                    return Helper.response(res, 200, "Error", "Booking id doesn't exists");
                }
            }
        } catch (error) {
            console.log(error)
            return Helper.response(res, 500, error.message);
        }
    },

    getBookingDetails: async (req, res) => {
        try {
            const { status } = req.query;

            if (status == "New") {
                const getBookingData = await bookingModel.find({Status: "Booking Requested"})
                if (getBookingData.length > 0) {
                    let newBookingData = [];
                    await Promise.all(getBookingData.map(async (item) => {
                        let rowData = {
                            booking_id: item._id,
                            customer_name: item.Customer_name,
                            customer_mobile: item.Customer_mobile,
                            pickup_address: item.Pickup_address,
                            drop_address: item.Drop_address,
                            travel_date: item.Travel_date,
                            pickup_time: item.Pickup_time,
                            favourite_car: item.Favourite_car,
                            booking_date: item.createdDate,
                            status: item.Status
                        }
                        newBookingData.push(rowData)
                    }))
                    if (newBookingData.length > 0) {
                        return Helper.response(res, 200, "Success", "New booking data fetched successfully", {newBookingData: newBookingData});
                    } else {
                        return Helper.response(res, 200, "Success", "New booking not found", {newBookingData: newBookingData});
                    }
                } else {
                    return Helper.response(res, 200, "Success", "New booking not found");
                }
            } else if (status == "Confirmed") {
                const getBookingData = await bookingModel.find({Status: "Booking Confirmed"})
                if (getBookingData.length > 0) {
                    let confirmedBookingData = [];
                    await Promise.all(getBookingData.map(async (item) => {
                        let rowData = {
                            booking_id: item._id,
                            customer_name: item.Customer_name,
                            customer_mobile: item.Customer_mobile,
                            pickup_address: item.Pickup_address,
                            drop_address: item.Drop_address,
                            travel_date: item.Travel_date,
                            pickup_time: item.Pickup_time,
                            favourite_car: item.Favourite_car,
                            booking_date: item.createdDate,
                            status: item.Status,
                            driver_name: item.Driver_name,
                            driver_mobile: item.Driver_mobile,
                            estimated_fare: item.Estimated_fare,
                            updated_date: item.updatedDate
                        }
                        confirmedBookingData.push(rowData)
                    }))
                    if (confirmedBookingData.length > 0) {
                        return Helper.response(res, 200, "Success", "Confirmed booking data fetched successfully", {confirmedBookingData: confirmedBookingData});
                    } else {
                        return Helper.response(res, 200, "Success", "Confirmed booking not found", {confirmedBookingData: confirmedBookingData});
                    }
                } else {
                    return Helper.response(res, 200, "Success", "Confirmed booking not found");
                }
            } else if (status == "Cancelled") {
                const getBookingData = await bookingModel.find({Status: "Booking Cancelled"})
                if (getBookingData.length > 0) {
                    let cancelledBookingData = [];
                    await Promise.all(getBookingData.map(async (item) => {
                        let rowData = {
                            booking_id: item._id,
                            customer_name: item.Customer_name,
                            customer_mobile: item.Customer_mobile,
                            pickup_address: item.Pickup_address,
                            drop_address: item.Drop_address,
                            travel_date: item.Travel_date,
                            pickup_time: item.Pickup_time,
                            favourite_car: item.Favourite_car,
                            booking_date: item.createdDate,
                            status: item.Status,
                            cancellation_reason: item.Cancellation_reason,
                            updated_date: item.updatedDate
                        }
                        cancelledBookingData.push(rowData)
                    }))
                    if (cancelledBookingData.length > 0) {
                        return Helper.response(res, 200, "Success", "Cancelled booking data fetched successfully", {cancelledBookingData: cancelledBookingData});
                    } else {
                        return Helper.response(res, 200, "Success", "Cancelled booking not found", {cancelledBookingData: cancelledBookingData});
                    }
                } else {
                    return Helper.response(res, 200, "Success", "Cancelled booking not found");
                }
            }
        } catch (error) {
            console.log(error)
            return Helper.response(res, 500, error.message);
        }
    }
}