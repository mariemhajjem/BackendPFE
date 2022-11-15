const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EntrepriseSchema = new Schema(
  {
    matricule_fiscale: {
      type: String,
      required: true,
      unique : true
    },
    company_name: {
      type: String,
      required: true
    },
    company_residence: {
      type: Array,
      required: true
    },
    company_address: {
      type: String
    },
    company_phoneNumber: {
      type: String,
      required: true,
      unique : true
    }, 
    company_email: {
      type: String, 
      
    },  
    isVerified: {
      type: Boolean,
      required :true,
      default : false
    },
  }
);

module.exports = mongoose.model(
  "Entreprise",
  EntrepriseSchema
);