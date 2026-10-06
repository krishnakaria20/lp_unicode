import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/mailer.js";

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

    sendEmail(user.email , "Registeration message" , `Hi ${user.name} . Your account has been created successfully`);

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

    sendEmail(user.email , "Login detected" , `Hello ${user.name} , your login was successful`);

    const accessToken = jwt.sign({userId : user._id} , process.env.JWT_SECRET , AccessTokenExpiresIn);
    const refreshToken = jwt.sign({userId : user._id} , process.env.JWT_REFRESH_SECRET , RefreshTokenExpiresIn);

    res.status(200).json({
        message : "Login successfull" ,
        accessToken ,
        refreshToken ,
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

const refreshAccessToken = (req , res) => {
    try{
        const {refreshToken} = req.body;

        if(!refreshToken){
            res.status(401).json({
                message : "Refresh token required"
            });
        }

        const decodedPayload = jwt.verify(refreshToken , process.env.JWT_REFRESH_SECRET);

        const accessToken = jwt.sign({userId : decodedPayload.userId} , process.env.JWT_SECRET , process.env.AccessTokenExpiresIn);

        res.status(200).json({accessToken});
    }

    catch(error){
        res.status(400).json({
            message : "Invalid or expired access token" , 
            error : error.message
        });
    }
}

const getProfile = async(req , res) => {
    try{
        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message : "User not found"
            });
        }

        res.status(200).json({
            user : {
                userId : user._id ,
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

export {registerUser , loginUser , refreshAccessToken , getProfile};