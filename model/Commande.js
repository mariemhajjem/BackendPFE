const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
	produit: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Produit",
		required: true
	},
	commande_qty: {
		type: Number,
		required: true
	}, 
	commande_date: {
		type: Date,
		required: true,
		default: Date.now
	},  
	enterprise: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Enterprise",
		required: true
	},
    product_owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Enterprise",
		required: true
	},



});

module.exports = mongoose.model('Commande', commandeSchema);