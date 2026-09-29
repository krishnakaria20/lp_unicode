const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async(req , res) => {
    
    try{
    const{name , email , password} = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser){
        return res.status(400).json({
            message : "User with this email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    const user = await User.create({
        name ,
        email ,
        password : hashedPassword
    });

    res.status(201).json({
        message : "User created successfully" , 
        user : {
            id : user._id ,
            name : user.name , 
            email : user.email
        }
    });
    }

    catch(error){
        res.status(500).json({
            message : "Server error" ,
            error : error.message
        });
    }
}

const loginUser = async(req , res) => {
    try{
        const{email , password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            message : "wrong email entered"
        });
    }

    const passwordMatch = await bcrypt.compare(password , user.password);

    if(!passwordMatch){
        return res.status(400).json({
            message : "wrong password entered"
        });
    }

    const accessToken = jwt.sign({userId : user._id} , process.env.JWT_SECRET);

    res.status(200).json({
        message : "Login successfull" ,
        accessToken , 
        user : {
            id : user._id ,
            name : user.name ,
            email : user.email
        }
    });
    }

    catch(error){
        res.status(500).json({
            message : "Server error" ,
            error : error.message
        });
    }
}

const isProtected = (req , res) => {
    res.status(200).json({
        message : "You are authenticated" ,
        userId : req.userId
    });
}

module.exports = {registerUser , loginUser , isProtected};