const Reclamation = require('../model/Reclamation');

const getAllReclamations = async (req, res) => {
    const reclamations = await Reclamation.find();
    if (!reclamations) return res.status(204).json({ 'message': 'No reclamations found.' });
    return res.json(reclamations);
}


const createReclamation = async (req, res) => {
    const { reclamationText, email } = req?.body;
    if (!email) {
        return res.status(400).json({ 'message': 'email is required' });
    }
    
    let result;

    try {
        //create and store 
        result = await Reclamation.create({
            reclamationText, email
        });
        console.log(result);

    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }

    return res.json(result);

} 

const deleteReclamation = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Reclamation ID required.' });

    const reclamation = await Reclamation.findOne({ _id: req.body.id }).exec();
    if (!reclamation) {
        return res.status(204).json({ "message": `No reclamation matches ID ${req.body.id}.` });
    }
    const result = await reclamation.deleteOne(); //{ _id: req.body.id }
    return res.json(result);
}

const getReclamation = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Reclamation ID required.' });

    const reclamation = await Reclamation.findOne({ _id: req.params.id }).exec();
    if (!reclamation) {
        return res.status(204).json({ "message": `No reclamation matches ID ${req.params.id}.` });
    }
    return res.json(reclamation);
}

module.exports = {
    getAllReclamations,
    createReclamation, 
    deleteReclamation,
    getReclamation
}