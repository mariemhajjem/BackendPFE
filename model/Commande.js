const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
	commande_summary: [
		{
			produit: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Produit",
				required: true
			},
			quantity: {
				type: Number,
				required: true
			},
		}
	],
	commande_date: {
		type: Date,
		required: true,
		default: Date.now
	},
	commande_status: {
		type: String,
		required: true,
		enum: ['En cours', "Confirmé", "Annulée"],
		default: 'En cours'
	},
	enterpriseClt: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EntrepriseClient",
		required: true,
		default: null
	}
});

module.exports = mongoose.model('Commande', commandeSchema);