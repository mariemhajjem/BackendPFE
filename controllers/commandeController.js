const { Commande, CommandeFournisseur } = require('../model/Commande');
const EntrepriseClient = require('../model/EntrepriseClient')

const getAllCommandes = async (req, res) => {
    const commandes = await Commande.find().populate(["entrepriseClt","commande_summary.produit"]);
    if (!commandes) return res.status(204).json(commandes);
    return res.json(commandes);
}

const getAllCommandesByUser = async (req, res) => {
    console.log(req.body)
    if (!req.body)
        return res.status(400).json({ "message": `No commande matches your entreprise.` });
    let commandes
    if (req.body?.idEntrepriseImport) {
        try {
            commandes = await CommandeFournisseur.find({ enterpriseImport: req.body.idEntrepriseImport }).populate(["entrepriseClt","commande_summary.produit"]);
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }
    } else {
        try {
            commandes = await Commande.find({ entrepriseClt: req.body.idEntrepriseClt }).populate(["entrepriseClt","commande_summary.produit"]);
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }
    }
    if (!commandes) return res.status(204).json(commandes);
    return res.json(commandes);
}

const createNewCommande = async (req, res) => {
    const {
        commande_summary,
        commande_address,
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
    let results = commande_summary.reduce(function (results, prod) {
        (results[prod.idFournisseur] = results[prod.idFournisseur] || []).push(prod);
        return results;
    }, {})
    console.log(results)
    let result;

    try {
        //create and store 
        result = await Commande.create({
            commande_summary,
            commande_address,
            entrepriseClt: entrepriseClt[0]?._id,
        });
        console.log(result)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 'message': err.message });
    }

    Object.keys(results).forEach(async function (key, index) {
        try {
            //create and store 
            await CommandeFournisseur.create({
                commande_summary: results[key],
                commande_address,
                entrepriseClt: entrepriseClt[0]?._id,
                enterpriseImport: key,
            });

        } catch (err) {
            console.log(err.message)
            return res.status(500).json({ 'message': err.message });
        }
    });


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

const updateCommande = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Commande ID required.' });
    let commande;
    try {
        commande = await Commande.findOne({ _id: req.body.id }).populate(["entrepriseClt","commande_summary.produit"]).exec();
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

    if (!commande) {
        return res.status(204).json({ "message": `No commande matches ID ${req.body.id}.` });
    }
    commande.commande_status = req.body.commande_status
    let result
    try {
        result = await commande.save()
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    
    return res.json(result);
}

module.exports = {
    getAllCommandes,
    getAllCommandesByUser,
    createNewCommande,
    getCommande,
    updateCommande
}