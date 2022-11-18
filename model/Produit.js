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
		type: String,
	},
	product_date: {
		type: Date,
		required: true,
		default: Date.now()
	},
    product_availability: {
		type: String,
		enum: ["En Stock", "Pré-commande", "Epuisé", "Disponibilité limitée", "En rupture de stock"],
		default: "En Stock"
	},
	quality_level: {
		type: String,
		enum: ["Neuf avec emballage", "Neuf sans emballage","Retour client fonctionnel","Dommages dûs au transport"],
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
	enterprise: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EntrepriseImport",
		// required: true
	},
	subscribed_enterprises: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "EntrepriseClient",
		}
	]


});

module.exports = mongoose.model('Produit', productSchema);