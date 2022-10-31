const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phoneNumber: {
		type: String,
		unique: true
	},
	address: {
		type: String
	},
	password: {
		type: String
	},
	creation_date: {
		type: Date,
		required: true,
		default: Date.now
	},
	lastSeen: [
        {
            date : {
                type: Date, 
                default: Date.now
            },
            status: {
                type: String,
                required: true,
                enum: ['LoggedIN', 'LoggedOut'],
                default: 'LoggedIN'
            },
	    }
    ],
	role: {
		type: String,
		enum: ['ADMIN', 'CLIENT', "IMPORTATEUR", "EMPLOYEE"],
		default: 'CLIENT'
	},
    employee_grade : {
        type: String,
		enum: ['OWNER', 'RH', "SALE", "OTHER"],
		default: 'OTHER'
    },
    isBlocked: {
		type: Boolean, 
		default: false
	},
	enterprise: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Enterprise"
	}, 
	// google_info : {}
});

module.exports = mongoose.model('Employee', employeeSchema);