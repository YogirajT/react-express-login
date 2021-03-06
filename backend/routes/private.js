const express = require('express');
const passport = require('passport');
const router = express.Router();
const { cleanupUser } = require('../helpers');
const validators = require('../validators');
const isBase64 = require('is-base64');
const uuid = require('uuid');
const fsx = require('fs-extra');
const path = require('path');
const { editValidator } = require('../validators');


router.get('/profile', (req, res) => {
    const user = cleanupUser(req.user.dataValues); 
    res.json(user);
});

router.post('/profile', async (req, res) => {
    const validationResult = validators.editValidator(req.body);
    if(validationResult.errors.length) return res.status(422).send({ error: validationResult.errors.map(e => e.message)});
    const base64String = req.body.profileImage;
    let imageName = "";
    if(base64String && isBase64(base64String, { mimeRequired: true })) {
        let profileImage = base64String.split(';base64,').pop();
        imageName = req.user.profileImage || uuid.v4();
        try {
            await fsx.writeFile(path.resolve(`./images/${imageName}.png`), profileImage, { encoding: 'base64' })
        } catch(e) {
            console.log(e)
            return  res.status(422).send({ message: 'Image upload failed' });
        }
    }
    const data = {};
    if(imageName) data.profileImage = imageName;
    if(req.body.firstName) data.firstName = req.body.firstName;
    if(req.body.lastName) data.lastName = req.body.lastName;
    if(req.body.age) data.age = req.body.age;
    if(req.body.phone) data.phone = req.body.phone;
    if(req.body.address) data.address = req.body.address;

    req.user.update(data).then((newUser) => {
        if (!newUser) return res.status(422).send("Something went wrong");
        if (newUser) return res.send(cleanupUser(newUser.dataValues))
    });
});

module.exports = router;