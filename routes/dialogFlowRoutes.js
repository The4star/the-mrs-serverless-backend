const express = require('express');
const router = express.Router();

const { textQuery, eventQuery } = require('../config/chatbot')

router.get('/',  (req, res, next) => {
    res.send({response: 'hello'})
})

router.post('/api/df_text_query', async (req, res) => {

    try {
        const response = await textQuery(req.body.text, req.body.userId, req.body.parameters)
        res.send(response)
    } catch (error) {
        res.status(500).send(error)
    }
    
})

router.post('/api/df_event_query', async (req, res) => {
    try {
        const response = await eventQuery(req.body.event, req.body.userId, req.body.parameters)
        res.send(response)
    } catch (error) {
        res.status(500).send('error ' + error)
    }
})


module.exports = router;