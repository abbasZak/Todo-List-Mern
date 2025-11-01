const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    

    try {
        const { fullName, email, password  } = req.body;

        const hashedPassword = await bcrypt(password, 10);


        if (!fullName || !email || !password) {
            res.status(400).json({message: "All fields are required"});
        }

        // Check if user exists
        const existingUser = User.findOne({ email });

        if( existingUser ) {
            res.status(201).json({message: "Account already exists"});
        }

        let newUser =  User.create({fullName, email, password: hashedPassword});
        res.status(201).json({ message: "User registered successfully", newUser });
        
} catch(error) {
    res.status(500).json({ message: error.message });
}
    
};

module.exports = { createUser };
