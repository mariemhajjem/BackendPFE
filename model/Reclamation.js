const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reclamationSchema = new Schema({
    reclamationText: {
		type: String,
		required: true
	},
    dateSentReport: {
		type: Date,
		required: true,
		default : Date.now
	},
	email: String,  
});

module.exports = mongoose.model('Reclamation', reclamationSchema);