const Commande = require('../model/Commande');
const EntrepriseClient = require('../model/EntrepriseClient')

const getAllCommandes = async (req, res) => {
    const commandes = await Commande.find().populate("enterpriseClt");
    if (!commandes) return res.status(204).json(commandes);
    return res.json(commandes);
}

const getAllCommandesByUser = async (req, res) => {
    if (!req.body?.entreprise) return res.status(400).json({ "message": `No commande matches your entreprise.` });
    let commandes
    try {
        commandes = await Commande.find({ enterprise: req.body.enterprise });
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    if (!commandes) return res.status(204).json(commandes);
    return res.json(commandes);
}

const createNewCommande = async (req, res) => {
    const {
        commande_summary,
        id
    } = req?.body;
    console.log(req?.body)
    let entrepriseClt
    try {
        entrepriseClt = await EntrepriseClient.find({ _id: id });
        console.log(entrepriseClt)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 'message': err.message });
    }
    let result;

    try {
        //create and store 
        result = await Commande.create({
            commande_summary,
            enterpriseClt: entrepriseClt[0]?._id,
        });
        console.log(result)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 'message': err.message });
    }

    return res.json(result);

}

const getCommande = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Commande ID required.' });

    const commande = await Commande.findOne({ _id: req.params.id }).exec();
    if (!commande) {
        return res.status(204).json({ "message": `No commande matches ID ${req.params.id}.` });
    }
    return res.json(commande);
}

module.exports = {
    getAllCommandes,
    getAllCommandesByUser,
    createNewCommande,
    getCommande
}