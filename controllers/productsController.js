const Resize = require('../middleware/Resize');
const Produit = require('../model/Produit');
const Categorie = require('../model/Categorie');
const EntrepriseImport = require('../model/EntrepriseImport')
const fs = require("fs");

const getProduits = async (req, res) => {
    const produits = await Produit.find().populate(["category_id","entrepriseImport"]);
    if (!produits) return res.status(204).json(produits);
    return res.json(produits);
}
const getAllProduits = async (req, res) => {
    const produits = await Produit.find({ isShown: true }).populate(["category_id","entrepriseImport"]);
    if (!produits) return res.status(204).json(produits);
    return res.json(produits);
}

const getAllProduitsByUser = async (req, res) => { 
    if (!req.body?.id) return res.status(400).json({ "message": `No produit matches your id.` });
    let produits
    try {
        produits = await Produit.find({ entrepriseImport: req.body.id }).populate(["category_id","entrepriseImport"]);
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    if (!produits) return res.status(204).json(produits);
    return res.json(produits);
}

const createNewProduit = async (req, res) => {
    const {
        product_label,
        product_description,
        product_price,
        product_category,
        product_quantity,
        id
    } = req?.body;
    console.log(req?.body)
    /* const imagePath = path.join(__dirname, '/public/images');
    const fileUpload = new Resize(imagePath);
    const filename = await fileUpload.save(req.file.buffer); */
    const imageUrl = fs.readFileSync("uploads/" + req.file?.filename);
    let product_picture = {data: imageUrl, contentType: req.file?.mimetype}
    /* if (!req.file) {
     const err = new Error(
           "Please provide an image"
         );
         err.code = 400;
         return next(err); 
     return res.status(400).json({error: 'Please provide an image'});
   } */
    // check for duplicate in the db
    const duplicate = await Produit.findOne({ product_label }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    let entrepriseImport
    try {
        entrepriseImport = await EntrepriseImport.find({ _id: id });
        console.log(entrepriseImport)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 'message': err.message });
    }
    let result;
    let duplicate_cat;
    if (req?.body?.product_category) {
        duplicate_cat = await Categorie.findOne({ category_name: product_category }).exec();
        if (!duplicate_cat) {
            try {
                duplicate_cat = await Categorie.create({
                    category_name: product_category
                });

            } catch (err) {
                console.log("error")
                //TODO : add categorie id et lui nommer "autre" manually in db to choose it here by default
            }
        }
    }

    try {
        //create and store 
        result = await Produit.create({
            product_label,
            product_description,
            product_price,
            category_id: duplicate_cat,
            product_picture,
            product_quantity,
            entrepriseImport: entrepriseImport[0]?._id
        });
        console.log(result)

    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }

    return res.json(result);

}

const updateProduit = async (req, res) => {
    const {
        product_label,
        product_description,
        product_price,
        product_quantity,
        product_category
    } = req?.body;
    
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }
    let produit;
    try {
        produit = await Produit.findOne({ _id: req.body.idProduit }).exec();
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    console.log("req", produit)
    if (!produit) {
        return res.status(204).json({ "message": `No produit matches ID ${req.body.id}.` });
    }
    let duplicate_cat;
    if (product_category) {
        duplicate_cat = await Categorie.findOne({ category_name: product_category }).exec();
        if (!duplicate_cat) {
            try {
                duplicate_cat = await Categorie.create({
                    category_name: product_category
                });

            } catch (err) {
                console.log("error")
                //TODO : add categorie id et lui nommer "autre" manually in db to choose it here by default
            }
        }
    }
    //TODO : add update 
    // produit = {...produit,...req?.body} 
    produit.product_label = product_label;
    produit.product_description = product_description;
    produit.product_price = product_price;
    produit.product_quantity = product_quantity;
    produit.category_id = duplicate_cat;
    
    let result
    try {
        result = await produit.save()
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    console.log("res: ",result)
    return res.json(result);
}

const deleteProduit = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Produit ID required.' });

    const produit = await Produit.findOne({ _id: req?.params?.id }).exec();
    if (!produit) {
        return res.status(204).json({ "message": `No produit matches ID ${req.body.id}.` });
    }
    const result = await produit.deleteOne(); //{ _id: req.body.id }
    return res.json(result);
}

const getProduit = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Produit ID required.' });

    const produit = await Produit.findOne({ _id: req.params.id }).populate(["category_id","entrepriseImport"]);
    if (!produit) {
        return res.status(204).json({ "message": `No produit matches ID ${req.params.id}.` });
    }
    return res.json(produit);
}

module.exports = {
    getProduits,
    getAllProduits,
    getAllProduitsByUser,
    createNewProduit,
    updateProduit,
    deleteProduit,
    getProduit
}