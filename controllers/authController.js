const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars')
const path = require('path');
const User = require("../model/User");
const creds = require("../config/contact");
const Entreprise = require('../model/Entreprise');
const EntrepriseClient = require('../model/EntrepriseClient');
const EntrepriseImport = require('../model/EntrepriseImport');

let transport = {
	service: "gmail",
	secure: false,
	port: 25,
	auth: {
		user: creds.USER,
		pass: creds.PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
};
let transporter = nodemailer.createTransport(transport);
// point to the template folder
const handlebarOptions = {
	viewEngine: {
		partialsDir: path.resolve('./views/'),
		defaultLayout: false,
	},
	viewPath: path.resolve('./views/'),
};
// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

let mailOptions = {
	from: '"Adebola" <mariemhajjem10@gmail.com>', // sender address
	to: 'mariemhajjem10@gmail.com', // list of receivers
	subject: 'Welcome!',
	template: 'email', // the name of the template file i.e email.handlebars
	context: {
		name: "Adebola", // replace {{name}} with Adebola
		company: 'My Company' // replace {{company}} with My Company
	},
	//In the root of your project, create a folder called attachments
	// attachments: [{ filename: "pic-1.pdf", path: "./attachments/pic-1.jpeg" }],
};
// trigger the sending of the E-mail
/* transporter.sendMail(mailOptions, function (error, info) {
	if (error) {
		return console.log(error);
	}
	console.log('Message sent: ' + info.response);
}); */

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let user;
	try {
		console.log(req.body)
		user = await User.findOne({ email }).populate(["enterpriseClt", "enterpriseImport"]).exec();
	} catch (error) {
		const err = new Error("Email fournis non valides, impossible de se connecter.");
		err.code = 404;
		return next(err);
	}

	if (!user) { 
		return res.status(404).json({ 'message': 'user not found' });
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

	if (!firstName || !lastName) { //TODO : add rest of required body params
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

	let exist;
	let user;
	//encrypt the password
	const hashedPwd = await bcrypt.hash(password, 10);
	switch (role) {
		case "FOURNISSEUR":

			try {
				exist = await EntrepriseImport.findOne({ matricule_fiscale }).exec();
			} catch (error) {
				return res.status(500).json({ 'message': error.message });
			}

			if (!exist) {
				try {
					//create and store the new Entreprise
					exist = await EntrepriseImport.create({
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
			try {
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
					enterpriseImport: exist._id
				});
				user.populate("enterpriseImport")

			} catch (err) {
				return res.status(500).json({ 'message': err.message });
			}
			break;
		case "CLIENT":
			try {
				exist = await EntrepriseClient.findOne({ matricule_fiscale }).exec();
			} catch (error) {
				return res.status(500).json({ 'message': error.message });
			}

			if (!exist) {
				try {
					//create and store the new Entreprise
					exist = await EntrepriseClient.create({
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
			};
			try {

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
					enterpriseClt: exist._id
				});
				user.populate("enterpriseClt");
			} catch (err) {
				return res.status(500).json({ 'message': err.message });
			}

			break;
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


exports.login = login;
exports.createNewUser = createNewUser;
