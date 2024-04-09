const { Router } = require("express");
const DoThis=require("../controller/regerstriton")
const router=Router()



router.get("/",DoThis.redirecttologin)

router.get("/signup",DoThis.singup)
router.post("/signup",DoThis.singup)


router.get(`/VerificationEmail`,DoThis.tokenval)

router.get("/login",DoThis.login)
router.post("/login",DoThis.login)

module.exports = router;
