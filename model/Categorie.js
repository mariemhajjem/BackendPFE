const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = { discriminatorKey: 'child' };

const categorySchema = new Schema({
    category_name: {
		type: String,
		required: true,
		unique: true,
	},
	category_children : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ChildCategory"
		}
	]
}, options);

const Categorie = mongoose.model('Category', categorySchema);

const ChildCategory = Categorie.discriminator('ChildCategory',
	new Schema({
		parent: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			default: null,
		},
	}, options));

module.exports = {
	Categorie,
	ChildCategory
}