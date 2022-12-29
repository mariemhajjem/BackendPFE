const { Categorie, ChildCategory } = require('../model/Categorie');

const getAllCategories = async (req, res) => {
	const categories = await Categorie.find({ child: { $exists: false } }).populate("category_children");;
	if (!categories) return res.status(204).json({ 'message': 'No categories found.' });
	return res.json(categories);
}

const createNewCategorie = async (req, res) => {
	const { category_name, category_children } = req?.body;
	if (!category_name) {
		return res.status(400).json({ 'message': 'category name is required' });
	}
	// check for duplicate in the db
	const duplicate = await Categorie.findOne({ category_name }).exec();
	if (duplicate) return res.sendStatus(409); //Conflict 
	let result;
	console.log(category_children)

	try {
		result = await Categorie.create({
			category_name,
		});
		console.log(result);
	} catch (err) {
		return res.status(500).json({ 'message': err.message });
	}
/* 
	let children = await Promise.all(category_children.map(async (child) => {
		let c, exist;
		try {
			exist = await ChildCategory.find({
				category_name: child,
			});
			console.log(exist)
		} catch (err) {
			console.log({ 'message': err.message });
		}

		if (!exist)
			try {
				c = await ChildCategory.create({
					category_name: child,
					parent: result._id,
				});
				console.log(c)
			} catch (err) {
				return res.status(500).json({ 'message': err.message });
			}
		else
			return exist
		exist = null;
		return c;
	}))

	try {
		result.category_children = children
		result = await result.save()

	} catch (err) {
		return res.status(500).json({ 'message': err.message });
	} */

	return res.json(result);
}

const updateCategorie = async (req, res) => {
	if (!req.body?._id) {
		return res.status(400).json({ 'message': 'ID parameter is required.' });
	}
	console.log(req.body)
	const categorie = await Categorie.findOne({ _id: req.body._id }).exec();
	if (!categorie) {
		return res.status(204).json({ "message": `No categorie matches ID ${req.body._id}.` });
	}/* 

	let children = await Promise.all(req.body.category_children?.map(async (child) => {
		let result, exist;
		console.log(child);
		try {
			exist = await ChildCategory.findOne({category_name: child});
			console.log(exist._doc)
		} catch (err) {
			console.log({ 'message': err.message });
		}

		if (!exist)
			try {
				result = await ChildCategory.create({
					category_name: child,
					parent: categorie._id,
				});
				console.log(result._doc)
			} catch (err) {
				console.log({ 'message': err.message });
			}
		else
			return exist
		exist = null;
		return result;
	}))

	console.log("children : ", children); */
	if (req.body?.category_name) categorie.category_name = req.body?.category_name;
	// if (req.body?.category_children && children) categorie.category_children.push(children);
	const result = await categorie.save();
	return res.json(result);
}

const deleteCategorie = async (req, res) => {
	if (!req.params?.id) return res.status(400).json({ 'message': 'Categorie ID required.' });
	const result = await Categorie.deleteOne({ _id: req.params.id });
	return res.json(result);
}

const getCategorie = async (req, res) => {
	if (!req?.params?.id) return res.status(400).json({ 'message': 'Categorie ID required.' });

	const categorie = await Categorie.findOne({ _id: req.params.id }).exec();
	if (!categorie) {
		return res.status(204).json({ "message": `No categorie matches ID ${req.params.id}.` });
	}
	return res.json(categorie);
}

module.exports = {
	getAllCategories,
	createNewCategorie,
	updateCategorie,
	deleteCategorie,
	getCategorie
}