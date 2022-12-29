const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = { discriminatorKey: 'type_demande' };

const demandeSchema = new Schema({
	demande_summary: {
		type: [
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
				price: {
					type: Number,
					required: true
				},
				statut: {
					type: Boolean,
					default: false
				}
			}
		],
		default: [],
		required: true,
	},
	demande_date: {
		type: Date,
		required: true,
		default: Date.now
	},
	demande_total: Number,
	demande_status: {
		type: String,
		required: true,
		enum: ['En cours', "Acceptée", "Terminée", "Refusée", "Acceptée partiellement"],
		default: 'En cours'
	},
	entrepriseClt: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EntrepriseClient",
		required: true,
		default: null
	}
}, options);

const Demande = mongoose.model('Demande', demandeSchema);

const DemandeFournisseur = Demande.discriminator('DemandeFournisseur',
	new mongoose.Schema({
		enterpriseImport: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "EntrepriseImport",
			default: null,
			required: true
		},
		demande: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Demande"
		}

	}, options));

module.exports = {
	Demande,
	DemandeFournisseur
}