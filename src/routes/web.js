const express = require('express');
const db = require('../db');
const { esc } = require('../utils');
const { requiresAuth } = require('express-openid-connect');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const allPassesCount = await db.getCountsAll();
        const activePassesCount = await db.getCountsActive();

        let auth = '';

        if (req.oidc.isAuthenticated()) {
            const passesList = await db.listPasses();
            const who = req.oidc.user.email || req.oidc.user.name;
            auth = `
            <p>Korisnik:${esc(who)} | <a href="/logout">Odjava</a></p>
            <h3>Propusnice:</h3>
            <ul>
                ${passesList.map((pass) => `
                    <li>
                        <a href="/info/${pass.id}">${esc(pass.name)}</a> - ${esc(pass.document)} - ${pass.issued_at.toISOString()} - ${esc(pass.status)}
                        <form method="POST" action="/passes/${pass.id}/cancel"><button type="submit">Cancel</button></form>
                        <form method="POST" action="/passes/${pass.id}/delete"><button type="submit">Delete</button></form>
                    </li>
                `).join('')}
            </ul>
            `;
        } else {
            auth = `<p><a href="/login">Prijava</a></p>`;
        }

        res.send(`
            <style>
                body { font-family: sans-serif; max-width: 600px; margin: 40px auto; }
                .broj { font-size: 2rem; font-weight: bold; }
            </style>
            <h1>Digitalne propusnice</h1>
            <p>Ukupno: <span class="broj">${allPassesCount.total}</span></p>
            <p>Aktivne: <span class="broj">${activePassesCount.total}</span></p>
            ${auth}
        `);
    } catch (err) {
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
            <p>Izdano: ${pass.issued_at.toISOString()}</p>`
        )

    } catch(err) {
        next(err)
    }
});

router.post('/passes/:id/cancel', requiresAuth(), async(req, res, next) => {
    try {
        await db.cancelPass(req.params.id);
        res.redirect('/');
    } catch(err) {
        next(err)
    }
}); 

router.post('/passes/:id/delete', requiresAuth(), async(req, res, next) => {
    try {
        await db.deletePass(req.params.id);
        res.redirect('/');
    } catch(err) {
        next(err)
    }
}); 


module.exports = router;