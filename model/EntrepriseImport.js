const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const EntrepriseImpt = new Schema({
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
    
  },  
  isVerified: {
    type: Boolean,
    required :true,
    default : false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
});
 
module.exports = mongoose.model( "EntrepriseImport", EntrepriseImpt);
 