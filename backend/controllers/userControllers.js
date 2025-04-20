const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

//@desc get all users (admin only )
//@routes GET /api/users/
//@access Private (Admin)


const getUsers = async (req, res)=>{
    
    try{
        const users = await User.find({ role:"member"}).select("-password");

        //add task
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user)=>{
                const pendingTasks = await Task.countDocuments({
                    assignedTo:user._id,
                    status:"Pending",

                });
                const inPrrogressTasks = await Task.countDocuments({
                    assignedTo:user._id,
                    status:"In Progress",

                });
                const completedTasks = await Task.countDocuments({
                    assignedTo:user._id,
                    status:"Completed",

                });
                 return{
                    ...user._doc, // incude data
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                 };
            })
        );

    }catch(error){
        res.status(500).json({ message :"Server Error", error: error.message});
    }
   
};

//@desc get users by id  
//@routes GET /api/users/:id
//@access Private 

const getUserById = async (req, res)=>{
    try{

        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json ({message : "User not Found "});
        res.json(user);
        
    }catch(error){
        res.status(500).json({ message :"Server Error", error: error.message});
    }
};



module.exports= {getUsers, getUserById };