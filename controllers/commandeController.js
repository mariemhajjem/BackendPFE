const { Commande, CommandeFournisseur } = require('../model/Commande');
const EntrepriseClient = require('../model/EntrepriseClient')
const Produit = require('../model/Produit');

const getAllCommandes = async (req, res) => {
    const commandes = await Commande.find().populate(["entrepriseClt", "commande_summary.produit"]);
    if (!commandes) return res.status(204).json(commandes);
    return res.json(commandes);
}

const getAllCommandesByUser = async (req, res) => {
    if (!req.body)
        return res.status(400).json({ "message": `No commande matches your entreprise.` });
    let commandes
    if (req.body?.idEntrepriseImport) {
        try {
            commandes = await CommandeFournisseur.find({ enterpriseImport: req.body.idEntrepriseImport }).populate(["entrepriseClt", "commande_summary.produit"]);
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }
    } else {
        let results
        try {
            results = await Commande.find({ type: { $exists: false }, entrepriseClt: req.body.idEntrepriseClt }).populate(["entrepriseClt", "commande_summary.produit"]);
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }

        commandes = await Promise.all(results.map(async (commande) => {
            let list
            try {
                list = await CommandeFournisseur.find({ type: { $exists: true }, commande: commande._id }).populate("commande_summary.produit");
            } catch (error) {
                return res.status(500).json({ 'message': error.message });
            }
            return { ...commande._doc, list }
        }))
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
            commande_address,
            entrepriseClt: entrepriseClt[0]?._id
        });
        console.log(result)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 'message': err.message });
    }

    let results = commande_summary.reduce(function (results, prod) {
        (results[prod.idFournisseur] = results[prod.idFournisseur] || []).push(prod);
        return results;
    }, {})

    Object.keys(results).forEach(async function (key, index) {
        try {
            //create and store 
            await CommandeFournisseur.create({
                commande_summary: results[key],
                commande_address,
                entrepriseClt: entrepriseClt[0]?._id,
                enterpriseImport: key,
                commande: result._id
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
        commande = await Commande.findOne({ _id: req.body.id }).populate(["entrepriseClt", "commande_summary.produit"]).exec();
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

    if (!commande) return res.status(204).json({ "message": `No commande matches ID ${req.body.id}.` });

    if (req.body.commande_status === "Refusée") commande.commande_status = req.body.commande_status
    else if (req.body.commande_status === "Confirmée") {
        let status = "Stock insuffisant";
        let confirmed = true;
        const summary = await Promise.all(commande.commande_summary.map(async (c) => {
            let produit;
            try {
                produit = await Produit.findOne({ _id: c.produit._id });
            } catch (error) {
                console.error({ 'message': error.message });
            }

            if (produit?.product_quantity >= c.quantity) {
                produit.product_quantity -= c.quantity;
                try {
                    await produit.save();
                } catch (error) {
                    console.error({ 'message': error.message });
                    confirmed = false
                    return c;
                }
                c.statut = true
                status = "Confirmée partiellement"
            } else { confirmed = false }

            return c
        }))

        let com;
        try {
            com = await Commande.findOne({ _id: commande.commande });
        } catch (error) {
            console.error({ 'message': error.message });
        }
        com.commande_status = "Confirmée partiellement"
        try {
            await com.save();
        } catch (error) {
            console.error({ 'message': error.message });
        }
        
        if (confirmed) commande.commande_status = "Confirmée"; else commande.commande_status = status;
        commande.commande_summary = summary;
    }

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