const EntrepriseClt = require('../model/EntrepriseClient');
const EntrepriseImport = require('../model/EntrepriseImport');
const Entreprise = require('../model/Entreprise');

const getAllEntreprises = async (req, res) => {
    const entreprises = await Entreprise.find();
    if (!entreprises) return res.status(204).json({ 'message': 'No entreprises found.' });
    res.json(entreprises);
}


const createNewEntreprise = async (req, res) => {
    const {
        matricule_fiscal,
        company_name,
        company_address,
        company_phoneNumber,
        company_email,
        company_residence
    } = req?.body;
    if (!matricule_fiscal || !company_name) {
        return res.status(400).json({ 'message': 'company infos are required' });
    }
    // check for duplicate in the db
    const duplicate = await Entreprise.findOne({ matricule_fiscal }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    let result;

    try {
        //create and store 
        result = await Entreprise.create({
            matricule_fiscal,
            company_name,
            company_address,
            company_phoneNumber,
            company_email,
            company_residence
        });
        console.log(result);

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
 
    res.json(result);

}

const updateEntreprise = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const entreprise = await Entreprise.findOne({ _id: req.body.id }).exec();
    if (!entreprise) {
        return res.status(204).json({ "message": `No entreprise matches ID ${req.body.id}.` });
    }
   //TODO : add update 
    const result = await entreprise.save();
    res.json(result);
}

const deleteEntreprise = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Entreprise ID required.' });

    const entreprise = await Entreprise.findOne({ _id: req.body.id }).exec();
    if (!entreprise) {
        return res.status(204).json({ "message": `No entreprise matches ID ${req.body.id}.` });
    }
    const result = await entreprise.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getEntreprise = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Entreprise ID required.' });

    const entreprise = await Entreprise.findOne({ _id: req.params.id }).exec();
    if (!entreprise) {
        return res.status(204).json({ "message": `No entreprise matches ID ${req.params.id}.` });
    }
    res.json(entreprise);
}

module.exports = {
    getAllEntreprises,
    createNewEntreprise,
    updateEntreprise,
    deleteEntreprise,
    getEntreprise
}