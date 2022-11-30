const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	product_label: {
		type: String,
		required: true
	},
	product_description: {
		type: String,
		required: true
	},
	product_price: {
		type: Number,
		required: true
	},
	product_quantity: {
		type: Number,
	},
	product_picture: {
		data: Buffer,
		contentType: String,
	},
	product_date: {
		type: Date,
		required: true,
		default: Date.now()
	},
	product_availability: {
		type: String,
		enum: ["En Stock", "Pré-commande", "En arrivage", "Epuisé", "Disponibilité limitée", "En rupture de stock"],
		default: "En Stock"
	},
	quality_level: {
		type: String,
		enum: ["Neuf avec emballage", "Neuf sans emballage", "Retour client fonctionnel", "Dommages dûs au transport"],
		default: "Neuf avec emballage"
	},
	isShown: {
		type: Boolean,
		required: true,
		default: true
	},
	category_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category"
	},
	entrepriseImport: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EntrepriseImport",
		default: null
		// required: true
	},
	subscribed_entreprises: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "EntrepriseClient",
		}
	]


});

module.exports = mongoose.model('Produit', productSchema);