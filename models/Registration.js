const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
    name: String, 
    email: String,
    created: { type: Date, default: Date.now },
});

const Registration = new mongoose.model('Registration', RegistrationSchema);


module.exports = Registration;