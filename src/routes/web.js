const express = require('express');
const db = require('../db');
const { esc } = require('../utils');

const router = express.Router();

router.get('/', async(req, res, next) => {
    try {
        const allPasses = await db.getCountsAll();
        const activePasses = await db.getCountsActive();
        res.send(`
            <style>
                body { font-family: sans-serif; max-width: 600px; margin: 40px auto; }
                .broj { font-size: 2rem; font-weight: bold; }
            </style>
            <h1>Digitalne propusnice</h1>
            <p>Ukupno: <span class="broj">${allPasses.total}</span></p>
            <p>Aktivne: <span class="broj">${activePasses.total}</span></p>     
        `)
    } catch(err) {
        next(err);
    }
});

router.get('/info/:id', async(req, res, next) => {
    try {
        const pass = await db.getPass(req.params.id);
        if (!pass) return res.status(404).send('Propusnica ne postoji');

        res.send(`
            <style>
                body { font-family: sans-serif; max-width: 600px; margin: 40px auto; }
                .broj { font-size: 2rem; font-weight: bold; }
            </style>
            <h1>Propusnica</h1>
            <p>Status: <span class="broj">${pass.status}</span></p>
            <p>Ime i prezime: ${esc(pass.name)}</p>
            <p>Dokument: ${esc(pass.document)}</p>
            <p>Izdano: ${pass.issued_at.toISOString()}</p>        
        `)
    } catch(err) {
        next(err)
    }
});

module.exports = router;