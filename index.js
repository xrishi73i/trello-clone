
const express = require("express");
const {auth}= require("./auth.js")
//schema design 

const USER=[];
const ORGANIZATION = [];
const BOARD=[];
const ISSUE=[];


const app = express();
app.use(express.json());
let USER_ID=1;
let ORGANIZATION_ID =0;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "abajdnjndindknsnkfdn";



//create 
app.post("/signup",(req,res)=>{
    
    const {username,password} = req.body;
   

    const UserExists = USER.find(u=>u.username===username);
    if(UserExists){
        return  res.status(409).json({
            "message":"User already exists "
        })
    }
    USER.push({
        id:USER_ID,
        username,
        password,
      
    })
    USER_ID++;
    res.status(201).json({
    message: "User created successfully"
});
})
app.post("/signin",(req,res)=>{
     const username = req.body.username;
     const password = req.body.password;   
     const UserExist = USER.find(u=>u.username===username && u.password===password);
     if(!UserExist){
        return res.status(401).json({
            "message":"unauthorized access"
        })
     }
     const token = jwt.sign({
        userId: UserExist.id
},"abajdnjndindknsnkfdn");

res.json({
    token 
})})

app.post("/board",auth,(req,res)=>{
    const userId = req.USER_ID;
})
app.post("/organization",auth,(req,res)=>{
    const userId = req.USER_ID;
    ORGANIZATION.push(
        {   id:ORGANIZATION_ID++,
            title: req.body.title,
            description:req.body.description,
            admin:userId,
            member:[]
        }
    )
    res.json({
        message:"org created",
        id:ORGANIZATION_ID-1
    })

})
app.post("/add-member-to-organization",auth,(req,res)=>{
    const userId =req.USER_ID;
    const organizationId = req.body.organizationId ;
    const memberUsername= req.body.memberUsername;
    const organization = ORGANIZATION.find(org=> org.id ===organizationId);
    if(!organization || organization.admin!==userId){
        return res.status(411).json({
            message:"either org not exist or you are not admin"
        })

    }
    //this whole create a obj in the memeberUser
    const memberUser =USER.find(u=>u.username===memberUsername) ;
    if(!memberUser){
         return res.status(411).json({
            message:"No user with this username exists "
        })
       
    }
    organization.member.push(memberUser.id)
    res.json({
        message:"member added"
    })

})
app.delete("/member",auth,(req,res)=>{
    const userID = req.USER_ID;
    const organizationId = req.body.organizationId ;
    const memberUsername= req.body.memberUsername;z
    const organization = ORGANIZATION.find(org=> org.id ===organizationId);
    if(!organization || organization.admin!==userId){
        return res.status(411).json({
            message:"either org not exist or you are not admin"
        })

    }
    //this whole create a obj in the memeberUser
    const memberUser =USER.find(u=>u.username===memberUser) ;
    if(!memberExist){
         return res.status(411).json({
            message:"No user with this username exists "
        })
       
    }
    organization.member = ORGANIZATION.filter(user=>user.id!==memberUser.id);
    res.json({
        message:"member delted successfully"
    })



})
app.get("/organization",auth,(req,res)=>{
    const userID = req.USER_ID;
    const organizationId = parseInt(req.query.organizationId); 
    const organization = ORGANIZATION.find(org=> org.id ===organizationId);
    if(!organization || organization.admin!==userId){
        return res.status(411).json({
            message:"either org not exist or you are not admin"
        })

    }
    res.json({
        organization:{
            ...organization,
            member : organization.member.map(memberId=>{
                const user = USER.find(user=>user.id===memberId)
                return {
                    id:user.id,
                    username:user.username
                }
            })
        }
    })
 


})
app.listen(3000,()=>{
    console.log("server is running");
});