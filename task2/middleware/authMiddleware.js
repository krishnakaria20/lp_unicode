import jwt from "jsonwebtoken";

const authMiddleware = (req , res , next) => {
    try{
        const authHeader = req.headers.authorization;

        console.log("AUTH HEADER:", authHeader);

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message : "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedPayload = jwt.verify(token , process.env.JWT_SECRET);

        req.userId = decodedPayload.userId;

        next();
    }

    catch(error){
        res.status(401).json({
            message : "Invalid token" ,
            error : error.message
        });
    }
}

export default authMiddleware;