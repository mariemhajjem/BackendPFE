const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baseOption = {
  discriminatorKey: "Entreprise",
  collection: "Entreprise",
  timestamps: true,
};

const BaseCompanySchema = new Schema(
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
      required: true,
      
    }, 
    token : {
      type: String,
       required: true, 
       max: 8
    },
    isVerified: {
      type: Boolean,
      required :true,
      default : true
    },
  },
  baseOption
);

module.exports.BaseCompanySchema = mongoose.model(
  "BaseCompanySchema",
  BaseCompanySchema
);