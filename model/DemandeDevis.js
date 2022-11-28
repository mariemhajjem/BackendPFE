const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const demandeSchema = new Schema({
	produit: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Produit",
		required: true
	},
	demande_qty: {
		type: Number,
		required: true
	}, 
	demande_date: {
		type: Date,
		required: true,
		default: Date.now
	},  
	enterprise: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EntrepriseClient",
		required: true
	}
});

module.exports = mongoose.model('Demande', demandeSchema);