const mongoose = require("mongoose");
const Entreprise = require("./Entreprise");
const Schema = mongoose.Schema;

const EntrepriseImpt = new Schema({
  
  stock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
    }
  ],  
});

const EntrepriseImport = Entreprise.discriminator("EntrepriseImport", EntrepriseImpt);

module.exports = { EntrepriseImport };