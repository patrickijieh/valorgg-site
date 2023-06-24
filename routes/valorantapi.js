const fetch = require("node-fetch-commonjs");
const express = require('express');
const router = express.Router();

const matchSanitizer = require('../matchdataCleaner');

const accountdataURL = process.env.ACCOUNTDATA_API_URL;
const mmrURL = process.env.MMR_API_URL;
const matchdataURL = process.env.MATCHHISTORY_API_URL;

// account data
router.get('/val-account-data/:gameId/:gameTag', async (req, res) => {
    const headers = {
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8"
    };

    res.send( await fetch(accountdataURL + req.params.gameId + "/" + req.params.gameTag, { headers })
    .then((response) => response.json()));
});

// mmr data
router.get('/val-account-data/mmr/:gameId/:gameTag', async (req, res) => {
    const headers = {
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8"
    };

    res.send( await fetch(mmrURL + req.params.gameId + "/" + req.params.gameTag, { headers })
    .then((response) => response.json()));
});

// match history
router.get('/val-account-data/matches/:gameId/:gameTag', async (req, res) => {
    const headers = {
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8"
    };

    res.send(await fetch(matchdataURL + req.params.gameId + "/" + req.params.gameTag + "?filter=competitive", { headers })
    .then((response) => response.json())
    .then((data) => matchSanitizer(data)));
});

module.exports = router;
