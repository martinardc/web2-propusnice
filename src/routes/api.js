const express = require('express');
const db = require('../db');
const { checkJwt, requiredScopes } = require('../auth');

const router = express.Router();

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
})

module.exports = router;