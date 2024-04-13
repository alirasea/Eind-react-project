const { Router } = require("express");
const cors = require('cors')
const DoThis=require("../controller/regerstriton")
const router=Router()



router.get("/",DoThis.redirecttologin)

router.get("/home",async (req , res)=>{
    res.send("This is the data for the home page")
})

router.post("/post_formData",cors(),DoThis.singup)


router.get(`/VerificationEmail`,DoThis.tokenval)

router.get("/login",DoThis.login)
router.post("/login",cors(),DoThis.login)

module.exports = router;
