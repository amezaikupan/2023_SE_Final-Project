const express = require('express');
const router = express.Router();
const Conference = require('../models/conference_model'); 

// Route để lấy tất cả các hội nghị
router.get('/api/conferences', async (req, res) => {
  try {
    const conferences = await Conference.find();
    res.json(conferences);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the conferences.");
    console.error("Error fetching conferences:", error);
  }
});

// Process query
router.post('/api/conferences/query', async (req, res) => {
  try{
    const {topic, location, time, paperSubmissionOpen} = req.body
    let filter = {}

    // Filter topic of conference
    if(!(topic == "All Topic" || topic == '')){
      filter = {topic: topic};
    }

    // Filter location of conference
    if(!(location == "All Countries" || location == '')){          
      const regexQuery = new RegExp(location, 'i'); // 'i' flag for case-insensitive matching
      filter['location'] = regexQuery;
    }

    // Fail attempt at query request for date
    // My new approach is to fetch query for topic and location 
    // Then process date related data
    // if((!(time == "All Time" || time == ''))){
    //   const today = new Date();
    //   let limitDate = new Date()
    //   if(time === 'Next 1 week'){
    //     limitDate.setDate(today.getDate() + 7)
    //   }else if(time === 'Next 1 month'){
    //     limitDate.setDate(today.getDate() + 30)
    //   }else{
    //     limitDate.setDate(today.getDate() + 365)
    //   }

    //   filter['timeline.submissionDeadline'] = {$lt: limitDate}
    // }
    
    let filteredConference = await Conference.find(filter);


    // Filter date 
    const today = new Date();
    if((!(time == "All Time" || time == ''))){
      let limitDate = new Date()
      if(time === 'Next 1 week'){
        limitDate.setDate(today.getDate() + 7)
      }else if(time === 'Next 1 month'){
        limitDate.setDate(today.getDate() + 30)
      }else{
        limitDate.setDate(today.getDate() + 365)
      }

      filteredConference = filteredConference.filter(conf => ((conf.timeline['conferenceDates'][0]) < limitDate))
      // filteredConference = filteredConference.filter(conf => {
      //   console.log(conf.timeline['Conference Dates']);
      //   console.log("+++++++++++++++++++++");
      //   const conferenceDate = new Date(conf.timeline.conferenceDates[0]);
    
      //   return conferenceDate < limitDate && conferenceDate >= today;
      // });
      // console.log(limitDate)
      // console.log(today )
    }

    console.log(filteredConference[0].timeline)

    // Filter submission requirement
    if(paperSubmissionOpen){
      filteredConference = filteredConference.filter(conf => (new Date(conf.timeline['abstracts/full-textPaperSubmissionDeadline'])) > today)
    }

    // Post json
    res.json(filteredConference)

  }catch(error){
    res.status(500).send("An error occurred while processing query.");
    console.log("Error processing query: ", error);
  }
})


module.exports = router;