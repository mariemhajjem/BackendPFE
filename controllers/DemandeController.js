const { Demande, DemandeFournisseur } = require('../model/Demande');
const EntrepriseClient = require('../model/EntrepriseClient');

const getAllDemandes = async (req, res) => {
    const demandes = await Demande.find().populate(["entrepriseClt", "demande_summary.produit"]);
    if (!demandes) return res.status(204).json(demandes);
    return res.json(demandes);
}

const getAllDemandesByUser = async (req, res) => {
    if (!req.body)
        return res.status(400).json({ "message": `No demande matches your entreprise.` });
    let demandes
    console.log(req.body)
    if (req.body?.idEntrepriseImport) {
        try {
            demandes = await DemandeFournisseur.find({ enterpriseImport: req.body.idEntrepriseImport }).populate(["entrepriseClt", "demande_summary.produit"]);
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }
    } else {
        let results
        try {
            results = await Demande.find({ type_demande: { $exists: false }, entrepriseClt: req.body.idEntrepriseClt }).populate(["entrepriseClt", "demande_summary.produit"]);
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }
        // Search for all demandes fournisseur which belong to demande._id client
        demandes = await Promise.all(results.map(async (demande) => {
            let list
            try {
                list = await DemandeFournisseur.find({ type_demande: { $exists: true }, demande: demande._id }).populate("demande_summary.produit");
            } catch (error) {
                return res.status(500).json({ 'message': error.message });
            }
            return { ...demande._doc, list }
        }))
    }
    if (!demandes) return res.status(204).json(demandes);
    return res.json(demandes);
}

const createNewDemande = async (req, res) => {
    const {
        demande_summary,
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
        result = await Demande.create({
            demande_summary,
            entrepriseClt: entrepriseClt[0]?._id
        });
        console.log(result)

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ 'message': err.message });
    }
    let results = []
    results = demande_summary?.reduce(function (results, prod) {
        (results[prod.idFournisseur] = results[prod.idFournisseur] || []).push(prod);
        return results;
    }, {})
    console.log(results)
    if (results)
        Object.keys(results).forEach(async function (key, index) {
            try {
                //create and store 
                await DemandeFournisseur.create({
                    demande_summary: results[key],
                    entrepriseClt: entrepriseClt[0]?._id,
                    enterpriseImport: key,
                    demande: result._id
                });
            } catch (err) {
                console.log(err.message)
                return res.status(500).json({ 'message': err.message });
            }
        });

    return res.json(result);

}

const getDemande = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Demande ID required.' });

    const demande = await Demande.findOne({ _id: req.params.id }).exec();
    if (!demande) {
        return res.status(204).json({ "message": `No demande matches ID ${req.params.id}.` });
    }
    return res.json(demande);
}

const updateDemandeByFournisseur = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Demande ID required.' });

    let demande;
    try {
        demande = await Demande.findOne({ _id: req.body.id });
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    let demandeClient;
    try {
        demandeClient = await Demande.findOne({ type_demande: { $exists: false }, _id: demande.demande });
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

    if (!demande) return res.status(204).json({ "message": `No demande matches ID ${req.body.id}.` });

    if (req.body?.demande_status === "Refusée") {
        demande.demande_status = req.body.demande_status
        let summary = demande.demande_summary.map(p => {
            return { ...p._doc, statut: false }
        })
        demande.demande_summary = summary;
    } else if (req.body?.demande_status === "Acceptée") {
        // console.log(demande.demande_summary)
        demande.demande_status = "Acceptée"; // else demande.demande_status = status;
        let summary = demande.demande_summary.map(p => {
            return { ...p._doc, statut: true }
        })
        demande.demande_summary = summary;

        let summary_map = new Map();
        demandeClient.demande_summary.map((prod) => {
            summary_map.set(prod.produit.valueOf(), prod)
        })

        demande.demande_summary.map((demande) => {
            if (summary_map.get(demande.produit.valueOf()))
                summary_map.set(demande.produit.valueOf(), { ...summary_map.get(demande._doc?.produit?.valueOf()), statut: true })

        })

        let arr = []
        summary_map.forEach(function (value, key) {
            arr.push(value);
        })
        if (summary_map) demandeClient.demande_summary = arr;
        demandeClient.demande_status = "Acceptée partiellement";

    }

    try {
        await demandeClient.save()
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    
    if (req.body?.demande_summary)
        demande.demande_summary = req.body.demande_summary;

    let result
    try {
        result = await demande.save()
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    try {
        result = await Demande.findOne({ _id: req.body.id }).populate(["entrepriseClt", "demande_summary.produit"]).exec();
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

    return res.json(result);
}

const updateDemandeByClient = async (req, res) => {
    if (!req.body?.id) return res.status(400).json({ 'message': 'Demande ID required.' });
    console.log(req.body)
    let demande;
    try {
        demande = await Demande.findOne({ _id: req.body.id }).populate(["entrepriseClt", "demande_summary.produit"]).exec();
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

    if (!demande) return res.status(204).json({ "message": `No demande matches ID ${req.body.id}.` });
    // changer le statut en Terminée pour la demande client et toutes les demandes fournisseurs
    if (req.body?.demande_status === "Terminée") {
        demande.demande_status = "Terminée";
        let results
        try {
            results = await DemandeFournisseur.find({ type_demande: { $exists: true }, demande: req.body.id });
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }

        let demandes = await Promise.all(results.map(async (d) => {

            d.demande_status = "Terminée";
            try {
                await d.save()
            } catch (error) {
                return res.status(500).json({ 'message': error.message });
            }
        }))
        console.log(demandes)
    }

    // changer le statut en Acceptée pour la demande client 
    //et retourner seulement les demandes accéptée dans le summary
    else if (req.body?.demande_status === "Acceptée") {
        demande.demande_status = "Acceptée";
        // chercher tous les DemandeFournisseur lié à la demande client
        let results
        try {
            results = await DemandeFournisseur.find({ type_demande: { $exists: true }, demande: req.body.id });
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }

        let demandes = results.map(d => {
            if (d.demande_status === "Acceptée") return d;
        })
        console.log(demandes)
    }
    // changer le prix proposé par le client dans la demande summary du fournisseur
    if (req.body?.demande_summary) {
        let summary = req.body.demande_summary;
        let summary_map = new Map();
        summary.map((prod) => { summary_map.set(prod.produit, prod.price) })

        // chercher tous les DemandeFournisseur lié à la demande client
        let results
        try {
            results = await DemandeFournisseur.find({ type_demande: { $exists: true }, demande: req.body.id });
        } catch (error) {
            return res.status(500).json({ 'message': error.message });
        }

        // changer les anciens prix dans chaque demande fournisseur avec les prix proposés par le client
        let demandes = await Promise.all(results.map(async (demande) => {
            let list = demande.demande_summary.map((prod) => {
                if (summary_map.has(prod._doc.produit.valueOf())) {
                    return { ...prod._doc, price: summary_map.get(prod._doc.produit.valueOf()) }
                }
            })
            if (list) demande.demande_summary = list;
            try {
                await demande.save()
            } catch (error) {
                console.log({ 'message': error.message });
            }
        }))
    }


    let result
    try {
        result = await demande.save()
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    try {
        result = await Demande.findOne({ _id: req.body.id }).populate(["entrepriseClt", "demande_summary.produit"]).exec();
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
    console.log("final result \n" + result)
    return res.json(result);
}

module.exports = {
    getAllDemandes,
    getAllDemandesByUser,
    createNewDemande,
    getDemande,
    updateDemandeByFournisseur,
    updateDemandeByClient
}