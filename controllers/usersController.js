const User = require('../model/User');
const Entreprise = require('../model/Entreprise');
const EntrepriseClient = require('../model/EntrepriseClient');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  const users = await User.find().populate("enterprise");
  if (!users) return res.status(204).json({ 'message': 'No users found.' });
  res.json(users);
}


const login = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    console.log(req.body)
    user = await User.findOne({ email }).populate("enterprise");
  } catch (error) {
    const err = new Error("Somthing went wrong. could not login!");
    err.code = 500;
    return next(err);
  }
  if (!user) {
    const err = new Error(
      "Email fournis non valides, impossible de se connecter."
    );
    err.code = 404;
    return next(err);
  }
  let passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    const err = new Error(
      "Mot de passe non valide, impossible de se connecter."
    );
    err.code = 401;
    return next(err);
  }
  let token;
  try {
    token = jwt.sign(
      { user },
      "secret",
      { expiresIn: "1d" }
    );
  } catch (err) {
    const error = new Error("logging user failed. Please try again!");
    error.code = 500;
    return next(error);
  }

  return res.json(token);
};
const createNewUser = async (req, res) => {
  console.log(req?.body)
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    residence,
    password,
    role,
    gender,
    matricule_fiscale,
    company_name,
    company_phoneNumber,
    company_email,
    company_residence } = req?.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ 'message': 'First and last names are required' });
  }
  // check for duplicate usernames in the db
  let duplicate;
  try {
    duplicate = await User.findOne({ email }).exec();
  } catch (error) {
    return res.status(500).json({ 'message': error.message });
  }

  if (duplicate) return res.sendStatus(409); //Conflict 
  // check for duplicate usernames in the db
  let exist;
  try {
    exist = await Entreprise.findOne({ matricule_fiscale }).exec();
  } catch (error) {
    return res.status(500).json({ 'message': error.message });
  }


  if (!exist) {
    try {
      //create and store the new Entreprise
      exist = await Entreprise.create({
        matricule_fiscale,
        company_name,
        company_phoneNumber,
        company_email,
        company_residence
      });
      console.log(exist);

    } catch (err) {
      return res.status(500).json({ 'message': err.message });
    }
  }

  let user;

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //create and store the new user
    user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      residence,
      address,
      password: hashedPwd,
      role,
      gender,
      enterprise: exist.id
    });

  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }

  let token;
  try {
    token = jwt.sign(
      { user, exist },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
  } catch (err) {
    const error = new Error("logging user failed. Please try again!");
    error.code = 500;
    console.log(err);
    return res.status(500).json({ 'message': err.message });
    // return next(error);
  }
  return res.json(token);

}

const updateUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ 'message': 'ID parameter is required.' });
  }

  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.status(204).json({ "message": `No user matches ID ${req.body.id}.` });
  }
  if (req.body?.firstName) user.firstName = req.body.firstName;
  if (req.body?.lastName) user.lastName = req.body.lastName;
  const result = await user.save();
  res.json(result);
}

const deleteUser = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': 'User ID required.' });

  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.status(204).json({ "message": `No user matches ID ${req.body.id}.` });
  }
  const result = await user.deleteOne(); //{ _id: req.body.id }
  res.json(result);
}

const getUser = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required.' });

  const user = await User.findOne({ _id: req.params.id }).populate("enterprise").exec();
  if (!user) {
    return res.status(204).json({ "message": `No user matches ID ${req.params.id}.` });
  }
  res.json(user);
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser,
  login
}