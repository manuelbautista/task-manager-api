const express = require('express');
require('./db/mongoose');  // correr el mongoose.js
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT //|| 3000; // env.PORT HEROKU SERVER O 3000 LOCALHOST

const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000 // max size from file = 1 mb
    },
    fileFilter(req, file, cb) {
        //if not pdf
        //if(!file.originalname.endsWith('.pdf')){
            if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document'));
        }
        //if everything is ok
        cb(undefined, true);
    }
})
// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my middleware')
// }
//here using a middleware to send custom error
app.post('/upload', upload.single('upload') , (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
})
//upload in the single is the id of the file, sent trought by request
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// })
// app.use((req, res, next) => {
//     //res.status(503).send("We are under maintenance, please try again later");
// })

app.use(express.json());
app.use(userRouter); // usar archivo en vez de poner aqui los post, get, etc
app.use(taskRouter);

// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const myFunction = async () => {
    //Json Web Tokens
    const token = jwt.sign({_id: 'abc123'}, 'thisismynewcourse', {expiresIn: '7 days'});
    console.log(token);

    const data = jwt.verify(token, 'thisismynewcourse');
    console.log(data);

    //Hash passwords
    // const password = '123456';
    // const hashedPasword = await bcrypt.hash(password, 8);

    // console.log(password);
    // console.log(hashedPasword);

    // const isMatch = await bcrypt.compare(password, hashedPasword);

    // console.log(isMatch);
}

myFunction();

// app.post('/users' , async (req, res)=> {
//     const user = new User(req.body);
//     try {
//         await user.save();
//         //this code here will just run if save is success
//         res.status(201).send(user);
//     } catch (error) {
//         res.status(400).send(error);
//     }
      
//     // user.save().then(()=> {
//     //     res.status(201).send(user);
//     // }).catch((err) => {
//     //     res.status(400).send(err);
//     // })
// })
// app.get('/users', async (req, res) => {

//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (error) {
//         res.status(500).send();
//     }
//     // User.find({}).then((users) => {
//     //     res.send(users);
//     // }).catch((e) => {
//     //     res.status(500).send();
//     // })   // to fetch all users
// })

// app.get('/users/:id', (req, res) => {
//     const _id = req.params.id;

//     User.findById(_id).then((user) => {
//         if(!user){
//             return res.status(404).send();
//         }
//         res.send(user);
//     }).catch((e) => {
//         res.status(500).send();
//     })   // to fetch user by id
// })

// app.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates =['name', 'email', 'password', 'age']; //just can update these properties
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update);
//     })
//     if(!isValidOperation) {
//         return res.status(404).send({error: 'Invalid update operation'});
//     }
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}); //new is gonna return the user with the update
//         if(!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(404).send(error);
//     }
// })

// app.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);

//         if(!user) {
//             return res.status(404).send();
//         }

//         res.send(user);

//     } catch (error) {
//         res.status(500).send(error);
//     }
// })

app.listen(port, () => {
    console.log('server up and running on port: ' + port);
})

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    //get the task owner object
    // const task = await Task.findById('5d4024f7bbb8b6288d003c22');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    //get all the task of the owner 
    //const user = await User.findById('5d4023a4ea30882873c01df3');
    //await user.populate('tasks').execPopulate();
    //console.log(user.tasks);

    //para hacer estas relaciones, se deben agregar al modelo de cada una de ellas
}

main();
