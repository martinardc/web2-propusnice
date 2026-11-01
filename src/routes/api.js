const express = require('express');
const db = require('../db');
const { checkJwt, requiredScopes } = require('../auth');
const router = express.Router();
const crypto = require('node:crypto');
const QRCode = require('qrcode');
const config = require('../config');

router.get('/passes/:id', checkJwt, requiredScopes('read:passes'), async (req, res, next) => {
    try {
        const pass = await db.getPass(req.params.id);
        if (!pass) return res.sendStatus(404);

        res.json({
            id: pass.id,
            name: pass.name,
            document: pass.document,
            issuedAt: pass.issued_at.toISOString(),
            status: pass.status,
        });

    } catch(err) {
        next(err);
    }
});

router.post('/passes', checkJwt, requiredScopes('create:passes'), async (req, res, next) => {
    try {
        const { name, document } = req.body || {};
        function valid(v) {
            if (typeof v !== 'string') return false;
            return v.trim() !== '';
        }

        if (!valid(name) || !valid(document)) {
            return res.status(400).json({ error: 'name i document su obavezni' });
        }

        const id = crypto.randomUUID();
        await db.createPass(id, name.trim(), document.trim());

        const png = await QRCode.toBuffer(`${config.baseUrl}/info/${id}`);
        res.status(201)
           .set('Location', `${config.baseUrl}/passes/${id}`)
           .type('image/png')
           .send(png);        

    } catch(err) {
        next(err)
    }
});

module.exports = router;