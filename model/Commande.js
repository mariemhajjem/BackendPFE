const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = { discriminatorKey: 'type' };

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
	commande_address: [
		{
			address: String,
			code_postal: String
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
		enum: ['En cours', "Confirmé", "Annulée", "Refusée"],
		default: 'En cours'
	},
	entrepriseClt: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EntrepriseClient",
		required: true,
		default: null
	}
}, options);

const Commande = mongoose.model('Commande', commandeSchema);

const CommandeFournisseur = Commande.discriminator('CommandeFournisseur',
	new mongoose.Schema({
		date_livraison: Date, 
		enterpriseImport: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "EntrepriseImport",
			default: null,
			required: true
		},
	}, options));

module.exports = {
	Commande,
	CommandeFournisseur
}
