const express = require('express');
const router = express.Router();

const { sendMessage, getMessage } = require('../../regulator/message/messageApi');

router.get(':id', getMessage);
router.post('/', sendMessage);

module.exports = router;