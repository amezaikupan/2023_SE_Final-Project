const express = require('express')
const cors = require('cors')
const fs = require('fs')
const app = express()
const conferenceModel = require('./model/conference_model')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/conference_cs')

app.get('/', (req, res) => {
    conferenceModel.find()
    .then((confs) => {
        // res.json(confs)
        const conference4List = confs.map((conf) => {
            const {Title, ShortName, category} = conf
            return {Title, ShortName, category}
        })

        res.status(200).json(conference4List)
    })
    .catch(err => res.json(err))
})

app.get('/query', (req, res) =>{
    conferenceModel.find()
    .then((conferences) => {
        const {category, location, time, sortby, isPaperSubOpen, limit} = req.query

        let sortedConf = [...conferences]
        console.log(category)
        // *category

        if(category) {
            sortedConf = sortedConf.filter((conference) => {
                return conference.Category.startsWith(category)
            })
        }

        if(location){
            sortedConf = sortedConf.filter((conference) => {
                return conference.location.includes(location)
            })
        }

        if(time){
            // Don't know what to filter
            // Range or specific date? 
        }

        if(sortby){
            sortedConf = sortedConf.sort((a, b) => a.Title - b.Title)
            // What is the different between sortby and time?
        }

        if(isPaperSubOpen){
            // I don't know how to check from data in JSON :0
        }

        const conference4List = sortedConf.map((conf) => {
            const {Title, ShortName, category} = conf
            return {Title, ShortName, category}
        })
        res.json(conference4List)
    })
    .catch(err => res.json(err))

})


app.listen(5000, () => {
    console.log("Server is listenining...")
})














// // Suppose data in the DB is always sorted 
// // because the data is updated and is push into the 
// // DB in turn of update (order of collection)

// const conferences_file = fs.readFileSync('./backend/database/data.json', 'utf8')
// const conferences = JSON.parse(conferences_file)

// // Get data for list display (all)
// app.get('/', (req, res) => {
//     if(conferences){
//         const conference4List = conferences.map((conf) => {
//             const {Title, ShortName, category} = conf
//             return {Title, ShortName, category}
//         })

//         res.status(200).json(conference4List)
//     }

//     res.status(200).send('<h1> No data found </h1>')
// })

// // Get data for list display (filter)
// app.get('/query', (req, res) =>{
//     const {category, location, time, sortby, isPaperSubOpen, limit} = req.query

//     let sortedConf = [...conferences]
//     console.log(category)
//     // *category

//     if(category) {
//         sortedConf = sortedConf.filter((conference) => {
//             return conference.Category.startsWith(category)
//         })
//     }

//     if(location){
//         sortedConf = sortedConf.filter((conference) => {
//             return conference.location.includes(location)
//         })
//     }

//     if(time){
//         // Don't know what to filter
//         // Range or specific date? 
//     }

//     if(sortby){
//         sortedConf = sortedConf.sort((a, b) => a.Title - b.Title)
//         // What is the different between sortby and time?
//     }

//     if(isPaperSubOpen){
//         // I don't know how to check from data in JSON :0
//     }

//     const conference4List = sortedConf.map((conf) => {
//         const {Title, ShortName, category} = conf
//         return {Title, ShortName, category}
//     })
//     res.json(conference4List)
// })

// app.listen(5000, ()=>{
//     console.log("Server is listening...")
// })