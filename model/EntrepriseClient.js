const mongoose = require("mongoose");
const Entreprise  = require("./Entreprise");
const Schema = mongoose.Schema;

const EntrepriseClt = new Schema({
  
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

const EntrepriseClient = Entreprise.discriminator("EntrepriseClient", EntrepriseClt);

module.exports = { EntrepriseClient };