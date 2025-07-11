const shortid = require("shortid");
const URL = require('../models/url');
const isValidURL = require('../utils/urlValidation');

async function handleGenerateNewShortURL(req,res){
    const body=req.body;
    if(!body.url) return res.status(400).json({error:'url is required'})

    if(!isValidURL(body.url)) return res.status(400).json({error:'invalid url'})

    const shortID=shortid();

    // check if the url is already in the database
    const existingURL=await URL.findOne({redirectURL:body.url});
    if(existingURL) return res.json({shortUrl :`${process.env.BASE_URL}/${existingURL.shortId}`});

    await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],

        });
    return res.json({shortUrl :`${process.env.BASE_URL}/${shortID}`});

}

async function redirectURL(req,res){
    const shortId= req.params.code;
    const entry= await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory: {timestamp: Date.now()},
            }
        }
    );
    // check if the url is expired
    if(entry.expiresAt < Date.now()) return res.status(400).json({error:'url expired'});
    if(!entry) return res.status(400).json({error:'shortId not found'});
    res.redirect(entry.redirectURL);
}

async function handleGetAnalytics(req,res){
    const shortId=req.params.code;
    const result=await URL.findOne({shortId});
    return res.json({totalClicks:result.visitHistory.length,
        analytics: result.visitHistory,
    });
}



module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
    redirectURL,
}
