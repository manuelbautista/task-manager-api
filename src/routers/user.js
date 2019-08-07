const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');


router.post('/users' , async (req, res)=> {
    const user = new User(req.body);
    try {
        await user.save();

        sendWelcomeEmail(user.email, user.name);

        const token = await user.generateAuthToken();

        //this code here will just run if save is success
        res.status(201).send({user, token});

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
      
    // user.save().then(()=> {
    //     res.status(201).send(user);
    // }).catch((err) => {
    //     res.status(400).send(err);
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});

    } catch (error) {
        res.status(404).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save();
        res.send();

    } catch (error) {
        res.status(500).send();
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();

    } catch (error) {
        res.status(500).send();
    }
})
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.get('/users', auth, async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send();
    }
    // User.find({}).then((users) => {
    //     res.send(users);
    // }).catch((e) => {
    //     res.status(500).send();
    // })   // to fetch all users
})

router.get('/users/:id', (req, res) => {
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }).catch((e) => {
        res.status(500).send();
    })   // to fetch user by id
})

router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates =['name', 'email', 'password', 'age']; //just can update these properties
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })
    if(!isValidOperation) {
        return res.status(404).send({error: 'Invalid update operation'});
    }

    try {
        //const user = await User.findById(req.user._id);
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        //I changed it, because to execute the middleware we need to call save
        //in the findbyidandupdate this is not called
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(404).send(error);
    }

})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates =['name', 'email', 'password', 'age']; //just can update these properties
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })
    if(!isValidOperation) {
        return res.status(404).send({error: 'Invalid update operation'});
    }
    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        //I changed it, because to execute the middleware we need to call save
        //in the findbyidandupdate this is not called
        await user.save();

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}); //new is gonna return the user with the update
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(404).send(error);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);

        // if(!user) {
        //     return res.status(404).send();
        // }
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);

        res.send(req.user);

    } catch (error) {
        res.status(500).send(error);
    }
})
const upload = multer({
    //dest: 'avatar', we dont need it anymore,  we are going to save it on DB
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image file'));
        }
        //if everything is ok
        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth ,upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    //req.user.avatar = req.file.buffer;   // we can just access this, if there is not dest prop
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
} );

router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    }
    catch(error) {
        res.status(500).send(error);
    }
})
router.get('/users/:id/avatar', async(req, res) => {
    try {
       const user = await User.findById(req.params.id);

       if(!user || !user.avatar) {
            throw new Error();
       }
       //setting the header response
       res.set('Content-Type', 'image/png');
       //sending back the user avatar.
       res.send(user.avatar);

    } catch (error) {
        res.status(404).send();
    }
    
    
})
// router.post('/users/me/avatar',upload.single('avatar'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message});
// } )

module.exports = router;