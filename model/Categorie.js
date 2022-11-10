const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category_name: {
		type: String,
		required: true
	},
	category_children : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category"
		}
	]
});

module.exports = mongoose.model('Category', categorySchema);