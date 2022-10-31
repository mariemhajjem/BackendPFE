const Reclamation = require('../model/Reclamation');

const getAllReclamations = async (req, res) => {
    const reclamations = await Reclamation.find();
    if (!reclamations) return res.status(204).json({ 'message': 'No reclamations found.' });
    res.json(reclamations);
}


const createReclamation = async (req, res) => {
    const { reclamationText, dateSentReport } = req?.body;
    if (!category_name) {
        return res.status(400).json({ 'message': 'category name is required' });
    }
     
    let result;

    try {
        //create and store 
        result = await Reclamation.create({
            reclamationText, dateSentReport
        });
        console.log(result);

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

    res.json(result);

} 

const deleteReclamation = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Reclamation ID required.' });

    const reclamation = await Reclamation.findOne({ _id: req.body.id }).exec();
    if (!reclamation) {
        return res.status(204).json({ "message": `No reclamation matches ID ${req.body.id}.` });
    }
    const result = await reclamation.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getReclamation = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Reclamation ID required.' });

    const reclamation = await Reclamation.findOne({ _id: req.params.id }).exec();
    if (!reclamation) {
        return res.status(204).json({ "message": `No reclamation matches ID ${req.params.id}.` });
    }
    res.json(reclamation);
}

module.exports = {
    getAllReclamations,
    createReclamation, 
    deleteReclamation,
    getReclamation
}