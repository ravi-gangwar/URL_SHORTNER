const {Router}=require('express');

const { handleGenerateNewShortURL,handleGetAnalytics }=require("../controllers/url");

const router = Router();

router.post("/", handleGenerateNewShortURL);

router.get('/analytics/:shortId',handleGetAnalytics);

module.exports = router;