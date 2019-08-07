const mongoose = require('mongoose');
const validator = require('validator');

//setting the connection and database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,   //create index in db
    useFindAndModify: false // remove warning message on mongoose
});


// const me = new User({
//     name: 'Juan Perez',
//     email: 'manuel@gmail.com',
//     password: '12345678'
// });

// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log('Error', error);
// });

//create table Task
// const Task = mongoose.model("Task", {
//     description: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     }
// })

// const task = new Task({
//     description: 'Learn mongoose library',
//     completed: true
// })

// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error);
// })