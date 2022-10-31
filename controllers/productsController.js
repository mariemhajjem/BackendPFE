const Produit = require('../model/Produit');

const getAllProduits = async (req, res) => {
    const produits = await Produit.find();
    if (!produits) return res.status(204).json({ 'message': 'No produits found.' });
    res.json(produits);
}


const createNewProduit = async (req, res) => {
    const {
        product_label,
        product_description,
        product_price,
        product_picture,
        product_date
    } = req?.body;
    if (!matricule_fiscal || !company_name) {
        return res.status(400).json({ 'message': 'company infos are required' });
    }
    // check for duplicate in the db
    const duplicate = await Produit.findOne({ matricule_fiscal }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    let result;

    try {
        //create and store 
        result = await Produit.create({
            product_label,
            product_description,
            product_price,
            product_picture,
            product_date
        });
        console.log(result);

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

    res.json(result);

}

const updateProduit = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const produit = await Produit.findOne({ _id: req.body.id }).exec();
    if (!produit) {
        return res.status(204).json({ "message": `No produit matches ID ${req.body.id}.` });
    }
    //TODO : add update 

    const result = await produit.save();
    res.json(result);
}

const deleteProduit = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Produit ID required.' });

    const produit = await Produit.findOne({ _id: req.body.id }).exec();
    if (!produit) {
        return res.status(204).json({ "message": `No produit matches ID ${req.body.id}.` });
    }
    const result = await produit.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getProduit = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Produit ID required.' });

    const produit = await Produit.findOne({ _id: req.params.id }).exec();
    if (!produit) {
        return res.status(204).json({ "message": `No produit matches ID ${req.params.id}.` });
    }
    res.json(produit);
}

module.exports = {
    getAllProduits,
    createNewProduit,
    updateProduit,
    deleteProduit,
    getProduit
}