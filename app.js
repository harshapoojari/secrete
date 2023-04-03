require("dotenv").config();
const express=require('express')
const bodyParser=require("body-parser")
const ejs=require('ejs')
const mongoose=require('mongoose')
const encrypt=require('mongoose-encryption');

const app=express();
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static(__dirname+'/public'))

mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser:true})

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
const secretcode=process.env.SECRET;
userSchema.plugin(encrypt,{secret:secretcode,encryptedFields:['password']})
const  User=new mongoose.model("User",userSchema)


app.get('/',(req,res)=>{
res.render("home")
})

app.get('/login',(req,res)=>{
    res.render("login")
})

app.get('/register',(req,res)=>{
    res.render("register")
})
app.post('/register',(req,res)=>{
    User.findOne({email:req.body.email}).then((value)=>{
    if(value==null)
    {
        const newUser=new User({
            email:req.body.email,
            password: req.body.password
        })
       newUser.save().then((result)=>{
        res.render('secrets')
       }).catch((err)=>{
        res.send(err)
       })
    }
    else
    {
        res.send("Email already exists")
    }
})
  
})
app.post('/login',(req,res)=>{
    const Email=req.body.email;
    const Password=req.body.password;
    
        User.findOne({email:Email}).then((value)=>{
            if(value)
            {
                if(value.password===Password)
                res.render('secrets')
                else
                res.send("Incorrect password")
            }
            else{
                res.send("Username not Exists")
            }
        }).catch((err)=>{
            res.send(err)
        })
    
    }
   
)

app.listen(3000,(req,res)=>{
    console.log("Successfully runnning on 3000");
})