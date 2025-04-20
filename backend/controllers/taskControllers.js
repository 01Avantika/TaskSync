const Task = require("../models/Task");

const getTasks = async ( req,res)=>{
    try {
        const { status} = (req,res)=>{
            let filter ={};
            if(status){
                filter.status = status;
            }
            let tasks;
        }

        if (req.user.role === "admin"){
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        } else{
            tasks = await Task.find({ ...filter, assignedTo:req.user._id}).populate(
              "assignedTo",
              "name email profileImageUrl"  
            );
        }

        //add complete todolist 

        tasks = await Promise.all(
            tasks.map(async (task)=>{
                const completedCount = task.todoChecklist.filter(
                    (item)=> item.completed
                ).lenght;
            })
        );

        //status summary

        const allTasks = await Task.countDocuments(
            req.user.role ==="admin"?{}:{assignedTo: req.user._id}
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status:"Pending",
            ...(req.user.role !== "admin "&& {assignedTo:req.user._id}),
        });

        const inProgressTask = await Task.countDocuments({
            ...filter,
            status:"In Progress",
            ...(req.user.role !== "admin "&& {assignedTo:req.user._id}),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status:"Compeleted",
            ...(req.user.role !== "admin "&& {assignedTo:req.user._id}),
        });

        res.jsonn ({
            tasks,
            statusSummary:{
                all:allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });


    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }
  
};


const getTaskById = async(req,res)=>{
    try {
        const task = await Task.findId(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"

        );
    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }

};

const createTask = async (req, res)=>{
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } =req.body;

        if(!Array.isArray(assignedTo)){
            return res 
            .status(400)
            .json({ message : "assignedTo must be an array of user ID's"});
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments,
        });

        res.satatus(201).json({message:"Task created succesfully", task });


    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }

} ;

const updateTask = async (req,res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({message:"Task not found"});

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res 
                .status(404)
                .json({ message :"assigned must be an array of user ID's"})
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updateTask = await task.save();
        res.json({message:"Task uploades Successfully", updateTask});
    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }
    
};
const deleteTask = async (req,res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"});

        await task.deleteOne();
        res,json ({message:"Task deleted succesfully"});

    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }
    
};
const updateTaskStatus = async (req,res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"});

        const isAssigned = task.assignedTo.some(
            (userId)=> userId.toString() === req.user._id.toString()
        );
        if(!isAssigned && req.user.role!=="admin"){
            return res.status(403).json({message:"Not authorized"});
        }

        task.status = req.body.status || task.status;

        if (task.status ==="Completed"){
            task.todoChecklist.forEach((item)=>(item.completed= true));
            task.progress= 100;
            
        }

    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }
    
};
const updateTaskCkecklist = async (req,res) => {
    try {
    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }
    
};
const getDashboardData = async (req,res) => {
    try {
    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }
    
};
const getUserDashboardData = async (req,res) => {
    try {
    } catch(error){
        res.status(500).json ({ message: "Server error ", error:error.message});

    }
};

module.exports ={
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCkecklist,
    getDashboardData,
    getUserDashboardData,
};
 



