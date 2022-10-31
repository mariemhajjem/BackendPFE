const mongoose = require("mongoose");
const { BaseCompanySchema } = require("./Entreprise");
const Schema = mongoose.Schema;

const Entreprise = new Schema({
  
  demandes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demande",
    }
  ],
  commandes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
    }
  ]
});

const EntrepriseClient = BaseCompanySchema.discriminator("EntrepriseClient", Entreprise);

module.exports = { EntrepriseClient };