'use strict';

//basic config
const express = require('express');
const server = express();
require('dotenv').config;
const cors = require('cors');
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT || 3031;


//add on config
const axios = require('axios');
const key = process.env.API_KEY;

//connectiong mongodb to server
const mongoose = require('mongoose');
mongoose.connect('mongodb://hayabalasmeh:1234@cluster0-shard-00-00.svu8n.mongodb.net:27017,cluster0-shard-00-01.svu8n.mongodb.net:27017,cluster0-shard-00-02.svu8n.mongodb.net:27017/food?ssl=true&replicaSet=atlas-lh448p-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

//building schema
const foodSchema = new mongoose.Schema({
    title: String,
    image: String,
});

//building modal
const foodModal = mongoose.model('food', foodSchema);


//building routs
//http://localhost:3031/
server.get('/', handleingHome);
//http://localhost:3031/getting
server.get('/getting', handleingGetting);
server.get('/displayingFav', handelingFav)
server.post('/addingFav', handelingAddingToFav);
server.delete('/deleteFav', handelingDelte);
server.put('/updateFav', handelingUpdate)
server.get('*', (req, resp) => {
    resp.send('oops not found this root');
});

//building functions
function handleingHome(req, resp) {
    resp.send('welcome to hoom root');
}
// class Recipe {
//     constructor(recipeName, recipeImage) {
//         this.recipeName = recipeName;
//         this.recipeImage = recipeImage;
//     }

// }
function handleingGetting(req, resp) {
    // const food = req.query.name;
    axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=f8e6b1dd49aa46cfa699e46d287fc7df`).then(response => {
        let returnedData = response.data.results;
        resp.send(returnedData);
        // console.log(returnedData);
    })
        .catch(err => {
            resp.send(`the encounter error is ${err}`)
        })
}
function handelingAddingToFav(req, resp) {
    console.log(req.body);
    const title = req.body.title;
    const image = req.body.image;
    const fav = new foodModal({
        title: title,
        image: image
    })
    fav.save();



}
function handelingFav(req, resp) {
    foodModal.find({}, (error, data) => {
        resp.send(data);
    })
}
function handelingDelte(req, resp) {
    const id = req.query.id;
    console.log(id);
    foodModal.deleteOne({ _id: id }, (error, data) => {
        if (error) {
            resp.send(error)
        } else {

            foodModal.find({}, (error, data) => {
                resp.send(data);
            })
        }

    })
}
function handelingUpdate(req, resp) {
    const title = req.body.title;
    const image = req.body.image;
    const id = req.body.id;
    foodModal.findOne({ _id: id }, (error, data) => {
        if (error) {
            resp.send(error)
        } else {
            data.title = title;
            data.image = image;
            data.save()
                // console.log(data);
                .then(() => {
                    foodModal.find({}, (error, data) => {
                        resp.send(data)
                    })
                })

        }
    })
}
//building listening
server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);

})

