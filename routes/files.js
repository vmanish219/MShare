const router = require("express").Router();
const multer=require("multer");
const path=require("path")
const File=require("../models/file")
const {v4:uuidv4}=require("uuid")
const sendMail=require("../services/emailService")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
  })
  
  let upload = multer({ 
      storage,
      limit:{fileSize:1000000*100}
     }).single("myfile");

router.post("/",(req,res)=>{
    

    upload(req,res,async(err)=>{
        // if(!req.file){
        //     return res.json({error:"Files are required"})
        // }

        if(err){
            return res.status(500).send({error:err.message})
        }

        const file=new File({
            filename:req.file.filename,
            uuid:uuidv4(),
            path:req.file.path,
            size:req.file.size
        });

        const response=await file.save();
        res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
    })
})

    router.post("/send", async(req,res)=>{
        // console.log(req.body);
        // return res.send({});
        const {uuid,fromEmail,toEmail}=req.body;
        if(!uuid || !fromEmail || !toEmail){
            return res.status(422).send({error:"All fields required."})
        }

        const file= await File.findOne({uuid: uuid});
        if(file.sender){
            return res.status(422).send({error:"Email already sent"})
        }
        file.sender=fromEmail;
        file.receiver=toEmail;
        const response=await file.save();


        sendMail({
            from:fromEmail,
            to:toEmail,
            subject: "MShare File Sharing",
            text:`${fromEmail} shared file with you.`,
            html:require("../services/emailTemplate")({
                fromEmail:fromEmail,
                downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size:parseInt(file.size/1000)+"KB",
                expires:"24 hrs"
            })
        })


    })





module.exports=router;