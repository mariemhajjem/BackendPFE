const mongoose = require("mongoose");
const { BaseCompanySchema } = require("./Entreprise");
const Schema = mongoose.Schema;

const Entreprise = new Schema({
  
  stock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
    }
  ],  
});

const EntrepriseImport = BaseCompanySchema.discriminator("EntrepriseImport", Entreprise);

module.exports = { EntrepriseImport };