const Resize = require('../middleware/Resize');
const Produit = require('../model/Produit');

const getAllProduits = async (req, res) => {
    const produits = await Produit.find();
    console.log(produits)
    if (!produits) return res.status(204).json({ 'message': 'No produits found.' });
    res.json(produits);
}

const createNewProduit = async (req, res) => {
    const {
        product_label,
        product_description,
        product_price,  
    } = req?.body;
    const imagePath = path.join(__dirname, '/public/images');
    const fileUpload = new Resize(imagePath);
    const filename = await fileUpload.save(req.file.buffer);
    if (!req.file) {
      res.status(401).json({error: 'Please provide an image'});
    }
   console.log("createNewProduit: ", req.body)
    // check for duplicate in the db
    const duplicate = await Produit.findOne({ product_label }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    let result;

    try {
        //create and store 
        result = await Produit.create({
            product_label,
            product_description,
            product_price,
            product_picture:filename,
        });
        console.log(result);

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

    res.json(result);

}

const updateProduit = async (req, res) => {
    const {
        product_label,
        product_description,
        product_price,  
    } = req?.body;
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }
    let produit;
    try{
        produit = await Produit.findOne({ _id: req.body.id }).exec();
    } catch(error){
        res.status(500).json({ 'message': error.message });
    }
    
    if (!produit) {
        return res.status(204).json({ "message": `No produit matches ID ${req.body.id}.` });
    }
    //TODO : add update 
    // produit = {...produit,...req?.body} 
    produit.product_label = product_label;
    produit.product_description = product_description;
    produit.product_price = product_price;
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