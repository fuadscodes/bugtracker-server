var express = require('express');
var router = express.Router();
const authorization = require('../middleware/authorization');

router.post('/', authorization,
    async (req, res) => {
        try {
            res.json(true);
        } catch (err) {
            console.error(err.message);
            res.status(500);
        }
    }
);

module.exports = router;