const bookingModel = require('../model/bookingModel');
const Helper = require('../configuration/helper');
const mongoose = require('mongoose');
const moment = require('moment');
const ObjectId = mongoose.Types.ObjectId;
const checkValidations = require('../middleware/validation');

module.exports = {
    generateBookingRequest: async (req, res) => {
        try {
            const { customer_name, customer_mobile, pickup_address, drop_address, travel_date, pickup_time, car_type } = req.body

            let validationStatus = {}

            //check validation for numeric value, special character & length should be 100 or less
            validationStatus = await checkValidations.checkValidation('customer_name', customer_name)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "customer_name" })
            }

            //check validation for special character, 9 digits, number starts with 6, 7, 8, 9
            validationStatus = await checkValidations.checkValidation('customer_mobile', customer_mobile)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "customer_mobile" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(customer_mobile)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "customer_mobile" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(customer_name)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "customer_name" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(pickup_address)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "pickup_address" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(drop_address)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "drop_address" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(travel_date)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "travel_date" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(pickup_time)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "pickup_time" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(car_type)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "car_type" })
            }

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
                    return Helper.response(res, 200, "Success", "Cab booking request sent successfully", {booking_id: bookCab.Booking_id});
                }else{
                    return Helper.response(res, 400, "Error", "Something went wrong, please try again");
                }
        } catch (error) {
            console.log(error)
            return Helper.response(res, 500, error.message);
        }
    },

    updateBookingStatus: async (req, res) => {
        try {
            const { booking_id, new_status, driver_name, driver_mobile, estimated_fare, cancellation_reason } = req.body

            let validationStatus = {}

            //check validation for numeric value, special character & length should be 100 or less
            validationStatus = await checkValidations.checkValidation('driver_name', driver_name)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "driver_name" })
            }

            //check validation for special character, 9 digits, number starts with 6, 7, 8, 9
            validationStatus = await checkValidations.checkValidation('driver_mobile', driver_mobile)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "driver_mobile" })
            }

            //check validation for name should be min 4 and max 100 character
            validationStatus = await checkValidations.checkStringLength(driver_name, 4, 100)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "driver_name" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(driver_mobile)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "driver_mobile" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(driver_name)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "driver_name" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(estimated_fare)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "estimated_fare" })
            }

            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(cancellation_reason)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "cancellation_reason" })
            }

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
                        return Helper.response(res, 400, "Error", "Something went wrong, please try again");
                    }
                } else {
                    return Helper.response(res, 400, "Error", "Booking id doesn't exists");
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
                        return Helper.response(res, 400, "Error", "Something went wrong, please try again");
                    }
                } else {
                    return Helper.response(res, 400, "Error", "Booking id doesn't exists");
                }
            }
        } catch (error) {
            console.log(error)
            return Helper.response(res, 500, error.message);
        }
    },

    getBookingDetails: async (req, res) => {
        try {
            const { status, page, limit } = req.query;
            const pageCount  = page?Number(page):1;
            const limitCount  = limit?Number(limit):10;
            const startIndex = (pageCount - 1) * limitCount;

            if (status == "New") {
                const getBookingData = await bookingModel.find({Status: "Booking Requested"}).skip(startIndex).limit(limit).sort({createdDate: -1})

                const totalBookingDataCount = await bookingModel.countDocuments({Status: "Booking Requested"})
                if (getBookingData.length > 0) {
                    let newBookingData = [];
                    await Promise.all(getBookingData.map(async (item) => {
                        let rowData = {
                            id: item._id,
                            booking_id: item.Booking_id,
                            customer_name: item.Customer_name,
                            customer_mobile: item.Customer_mobile,
                            pickup_address: item.Pickup_address,
                            drop_address: item.Drop_address,
                            travel_date: item.Travel_date,
                            pickup_time: item.Pickup_time,
                            favourite_car: item.Favourite_car,
                            booking_date: moment(item.createdDate).format('DD-MM-YYYY hh:mm A'),
                            status: item.Status
                        }
                        newBookingData.push(rowData)
                    }))
                    if (newBookingData.length > 0) {
                        return Helper.response(res, 200, "Success", "New booking data fetched successfully", {newBookingData: newBookingData, totalBookingDataCount: totalBookingDataCount});
                    } else {
                        return Helper.response(res, 400, "Error", "New booking not found", {newBookingData: newBookingData});
                    }
                } else {
                    return Helper.response(res, 400, "Error", "New booking not found");
                }
            } else if (status == "Confirmed") {
                const getBookingData = await bookingModel.find({Status: "Booking Confirmed"}).skip(startIndex).limit(limit).sort({createdDate: -1})

                const totalBookingDataCount = await bookingModel.countDocuments({Status: "Booking Confirmed"})
                if (getBookingData.length > 0) {
                    let confirmedBookingData = [];
                    await Promise.all(getBookingData.map(async (item) => {
                        let rowData = {
                            id: item._id,
                            booking_id: item.Booking_id,
                            customer_name: item.Customer_name,
                            customer_mobile: item.Customer_mobile,
                            pickup_address: item.Pickup_address,
                            drop_address: item.Drop_address,
                            travel_date: item.Travel_date,
                            pickup_time: item.Pickup_time,
                            favourite_car: item.Favourite_car,
                            booking_date: moment(item.createdDate).format('DD-MM-YYYY hh:mm A'),
                            status: item.Status,
                            driver_name: item.Driver_name,
                            driver_mobile: item.Driver_mobile,
                            estimated_fare: item.Estimated_fare,
                            updated_date: moment(item.updatedDate).format('DD-MM-YYYY hh:mm A')
                        }
                        confirmedBookingData.push(rowData)
                    }))
                    if (confirmedBookingData.length > 0) {
                        return Helper.response(res, 200, "Success", "Confirmed booking data fetched successfully", {confirmedBookingData: confirmedBookingData, totalBookingDataCount: totalBookingDataCount});
                    } else {
                        return Helper.response(res, 400, "Error", "Confirmed booking not found", {confirmedBookingData: confirmedBookingData});
                    }
                } else {
                    return Helper.response(res, 400, "Error", "Confirmed booking not found");
                }
            } else if (status == "Cancelled") {
                const getBookingData = await bookingModel.find({Status: "Booking Cancelled"}).skip(startIndex).limit(limit).sort({createdDate: -1})

                const totalBookingDataCount = await bookingModel.countDocuments({Status: "Booking Cancelled"})
                if (getBookingData.length > 0) {
                    let cancelledBookingData = [];
                    await Promise.all(getBookingData.map(async (item) => {
                        let rowData = {
                            id: item._id,
                            booking_id: item.Booking_id,
                            customer_name: item.Customer_name,
                            customer_mobile: item.Customer_mobile,
                            pickup_address: item.Pickup_address,
                            drop_address: item.Drop_address,
                            travel_date: item.Travel_date,
                            pickup_time: item.Pickup_time,
                            favourite_car: item.Favourite_car,
                            booking_date: moment(item.createdDate).format('DD-MM-YYYY hh:mm A'),
                            status: item.Status,
                            cancellation_reason: item.Cancellation_reason,
                            updated_date: moment(item.updatedDate).format('DD-MM-YYYY hh:mm A')
                        }
                        cancelledBookingData.push(rowData)
                    }))
                    if (cancelledBookingData.length > 0) {
                        return Helper.response(res, 200, "Success", "Cancelled booking data fetched successfully", {cancelledBookingData: cancelledBookingData, totalBookingDataCount: totalBookingDataCount});
                    } else {
                        return Helper.response(res, 400, "Error", "Cancelled booking not found", {cancelledBookingData: cancelledBookingData});
                    }
                } else {
                    return Helper.response(res, 400, "Error", "Cancelled booking not found");
                }
            }else{
                const getBookingData = await bookingModel.find().skip(startIndex).limit(limit).sort({createdDate: -1})

                const totalBookingDataCount = await bookingModel.countDocuments()
                if (getBookingData.length > 0) {
                    return Helper.response(res, 200, "Success", "Booking data fetched successfully", {getBookingData: getBookingData, totalBookingDataCount: totalBookingDataCount});
                } else {
                    return Helper.response(res, 400, "Error", "Booking data not found");
                }
            }
        } catch (error) {
            console.log(error)
            return Helper.response(res, 500, error.message);
        }
    },

    getBookingDetailsById: async (req, res) => {
        try {
            const { status, booking_id } = req.query;

            if (status == "New") {
                const getBookingData = await bookingModel.findOne({_id: ObjectId(booking_id), Status: "Booking Requested"})
                if (getBookingData) {
                        let newBookingData = {
                            id:  getBookingData ? getBookingData._id : "",
                            booking_id: getBookingData ? getBookingData.Booking_id : "",
                            customer_name:  getBookingData ? getBookingData.Customer_name : "",
                            customer_mobile:  getBookingData ? getBookingData.Customer_mobile : "",
                            pickup_address:  getBookingData ? getBookingData.Pickup_address : "",
                            drop_address:  getBookingData ? getBookingData.Drop_address : "",
                            travel_date:  getBookingData ? getBookingData.Travel_date : "",
                            pickup_time:  getBookingData ? getBookingData.Pickup_time : "",
                            favourite_car:  getBookingData ? getBookingData.Favourite_car : "",
                            booking_date: moment(getBookingData.createdDate).format('DD-MM-YYYY hh:mm A'),
                            status:  getBookingData ? getBookingData.Status : ""
                        }

                        return Helper.response(res, 200, "Success", "New booking data fetched successfully", {newBookingData: newBookingData});
                    }else {
                        return Helper.response(res, 400, "Error", "Booking data not found");
                    }
            } else if (status == "Confirmed") {
                const getBookingData = await bookingModel.findOne({_id: ObjectId(booking_id), Status: "Booking Confirmed"})
                if (getBookingData) {
                        let confirmedBookingData = {
                            id:  getBookingData ? getBookingData._id : "",
                            booking_id: getBookingData ? getBookingData.Booking_id : "",
                            customer_name: getBookingData ? getBookingData.Customer_name : "",
                            customer_mobile: getBookingData ? getBookingData.Customer_mobile : "",
                            pickup_address: getBookingData ? getBookingData.Pickup_address : "",
                            drop_address: getBookingData ? getBookingData.Drop_address : "",
                            travel_date: getBookingData ? getBookingData.Travel_date : "",
                            pickup_time: getBookingData ? getBookingData.Pickup_time : "",
                            favourite_car: getBookingData ? getBookingData.Favourite_car : "",
                            booking_date: moment(getBookingData.createdDate).format('DD-MM-YYYY hh:mm A'),
                            status: getBookingData ? getBookingData.Status : "",
                            driver_name: getBookingData ? getBookingData.Driver_name : "",
                            driver_mobile: getBookingData ? getBookingData.Driver_mobile : "",
                            estimated_fare: getBookingData ? getBookingData.Estimated_fare : "",
                            updated_date: moment(getBookingData.updatedDate).format('DD-MM-YYYY hh:mm A')
                        }

                        return Helper.response(res, 200, "Success", "Confirmed booking data fetched successfully", {confirmedBookingData: confirmedBookingData});
                    } else {
                        return Helper.response(res, 400, "Error", "Booking not found");
                    }
            } else if (status == "Cancelled") {
                const getBookingData = await bookingModel.findOne({_id: ObjectId(booking_id), Status: "Booking Cancelled"})
                if (getBookingData) {
                        let cancelledBookingData = {
                            id:  getBookingData ? getBookingData._id : "",
                            booking_id: getBookingData ? getBookingData.Booking_id : "",
                            customer_name: getBookingData ? getBookingData.Customer_name : "",
                            customer_mobile: getBookingData ? getBookingData.Customer_mobile : "",
                            pickup_address: getBookingData ? getBookingData.Pickup_address : "",
                            drop_address: getBookingData ? getBookingData.Drop_address : "",
                            travel_date: getBookingData ? getBookingData.Travel_date : "",
                            pickup_time: getBookingData ? getBookingData.Pickup_time : "",
                            favourite_car: getBookingData ? getBookingData.Favourite_car : "",
                            booking_date: moment(getBookingData.createdDate).format('DD-MM-YYYY hh:mm A'),
                            status: getBookingData ? getBookingData.Status : "",
                            cancellation_reason: getBookingData ? getBookingData.Cancellation_reason : "",
                            updated_date: moment(getBookingData.updatedDate).format('DD-MM-YYYY hh:mm A')
                        }

                        return Helper.response(res, 200, "Success", "Cancelled booking data fetched successfully", {cancelledBookingData: cancelledBookingData});
                    } else {
                        return Helper.response(res, 400, "Error", "Cancelled booking not found", {cancelledBookingData: cancelledBookingData});
                    }
            }else {
                return Helper.response(res, 400, "Error", "Invalid booking status");
            }
        } catch (error) {
            console.log(error)
            return Helper.response(res, 500, error.message);
        }
    },
}