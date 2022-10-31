const Employee = require('../model/Employee');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees);
}


const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    let user;
    try {
      user = await User.findOne({ email, password });
    } catch (error) {
      const err = new Error("Somthing went wrong. could not login!");
      err.code = 500;
      return next(err);
    }
  
    if (!user) {
      const err = new Error(
        "Identifiants fournis non valides, impossible de se connecter."
      );
      err.code = 404;
      return next(err);
    }
  
    let token;
    try {
      token = jwt.sign(
        { userId: user.id, cin: user.cin, role: user.role },
        "center_code",
        { expiresIn: "1d" }
      );
    } catch (err) {
      const error = new Error("logging user failed. Please try again!");
      error.code = 500;
      return next(error);
    }
  
    res.json({ token: token, user: user });
  };
const createNewEmployee = async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        phoneNumber,
        address,
        password,
        role,
        employee_grade } = req?.body;
    if (!firstname || !lastname || !req?.body?.google_info) {
        return res.status(400).json({ 'message': 'First and last names are required' });
    }
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    let result;
  
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        result = await Employee.create({
            firstname,
            lastname,
            email,
            phoneNumber,
            address,
            password : hashedPwd,
            role,
            employee_grade,
        });
        console.log(result);

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

    let token;
    try {
        token = jwt.sign(
          { result },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
      } catch (err) {
        const error = new Error("logging user failed. Please try again!");
        error.code = 500;
        return next(error);
      }
    res.json({ token, result });
    
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    login
}