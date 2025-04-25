const User = require('../models/User');
const UserDetails = require('../models/UserDetails');


//POST
exports.createUserDetails = async(req,res) => {
    try{
        const {Full_name , email , phone, address, gender, birth_day, country, language, payment_method, card_no, expiry_date, cvv} = req.body;
        
        //ensuring that there is an existiene email as it is used as a foreign key
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: 'User with this email not found'});
        }

        //creating new user
        const newUserDetail = new UserDetails({Full_name , email , phone, address, gender, birth_day, country, language, payment_method, card_no, expiry_date, cvv});
        await newUserDetail.save();
        res.status(201).json(newUserDetail);
    }
    catch(error)
    {
        res.status(500).json({message:"Error: Cannot Create User Details"});
    }
};

//GET
exports.getUserDetails = async(req,res) => {
    try{
        const userdetail = await UserDetails.findOne({email: req.params.email});
        if(!userdetail){
            return res.status(404).json({message: 'User Detils Not Found'});
        }
        res.status(200).json(userdetail);
    }
    catch(error){
        return res.status(500).json({message:"Error: Cannot Get User Details"});
    }
};

//Update
exports.updateUserDetails = async(req,res) => {
    try{
        const {Full_name, phone, address, gender, birth_day, country, language, payment_method, card_no, expiry_date, cvv} = req.body;
        
        const updateUserDetails = await UserDetails.findOneAndUpdate(
            {email: req.params.email},
            {Full_name, phone, address, gender, birth_day, country, language, payment_method, card_no, expiry_date, cvv},
            {new:true}
        );

        if(!updateUserDetails){
            return res.status(404).json({message: "Error: User Details Not Found For this email"});
        }

        res.status(200).json(updateUserDetails);
    }
    catch(error){
        res.status(500).json({message: "Error: Cannot Update User Details" , error:error.message})
    }
};