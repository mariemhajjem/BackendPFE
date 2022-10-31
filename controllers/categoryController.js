const Categorie = require('../model/Categorie');

const getAllCategories = async (req, res) => {
    const categories = await Categorie.find();
    if (!categories) return res.status(204).json({ 'message': 'No categories found.' });
    res.json(categories);
}


const createNewCategorie = async (req, res) => {
    const { category_name } = req?.body;
    if (!category_name) {
        return res.status(400).json({ 'message': 'category name is required' });
    }
    // check for duplicate in the db
    const duplicate = await Categorie.findOne({ category_name }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    let result;

    try {
        //create and store 
        result = await Categorie.create({
            category_name
        });
        console.log(result);

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

    res.json(result);

}

const updateCategorie = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const categorie = await Categorie.findOne({ _id: req.body.id }).exec();
    if (!categorie) {
        return res.status(204).json({ "message": `No categorie matches ID ${req.body.id}.` });
    }
     
    if (req.body?.category_name) categorie.category_name = category_name;
    const result = await categorie.save();
    res.json(result);
}

const deleteCategorie = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Categorie ID required.' });

    const categorie = await Categorie.findOne({ _id: req.body.id }).exec();
    if (!categorie) {
        return res.status(204).json({ "message": `No categorie matches ID ${req.body.id}.` });
    }
    const result = await categorie.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getCategorie = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Categorie ID required.' });

    const categorie = await Categorie.findOne({ _id: req.params.id }).exec();
    if (!categorie) {
        return res.status(204).json({ "message": `No categorie matches ID ${req.params.id}.` });
    }
    res.json(categorie);
}

module.exports = {
    getAllCategories,
    createNewCategorie,
    updateCategorie,
    deleteCategorie,
    getCategorie
}