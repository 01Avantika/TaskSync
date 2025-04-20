const express = require("express");
const{adminOnly, protect }= require("../middlewares/authMiddlewares");
const { getUsers, getUserById, deleteUser } = require("../controllers/userControllers");

const router = express.Router();

//user managemet Routes

router.get("/",protect,adminOnly, getUsers);
router.get("/:id",protect, getUserById);



module.export = router;


