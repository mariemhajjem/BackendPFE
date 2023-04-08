const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
	residence: {
		type: String
	},
	password: {
		type: String
	},
	gender: {
		type: String,
		enum: ['male', 'female','other'],
		default: 'none'
	},
	pic: {
		type: "String",
		required: true,
		default:
		  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
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
		enum: ['ADMIN', 'CLIENT', "FOURNISSEUR", "EMPLOYEE"],
		default: 'CLIENT'
	},
    user_grade : {
        type: String,
		enum: ['OWNER', 'RH', "SALE", "OTHER"],
		default: 'OTHER'
    },
    isBlocked: {
		type: Boolean, 
		default: false
	},
	entrepriseClt: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EntrepriseClient",
		default: null
	}, 
	entrepriseImport: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EntrepriseImport",
		default: null
	}, 
	// google_info : {}
});

module.exports = mongoose.model('User', userSchema);