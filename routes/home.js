const express = require('express');
const router = express.Router();
const Club = require('../models/club'); // ✅ Use capital 'C' as per the model export

// Homepage - show all clubs
router.get('/', async (req, res) => {
  try {
    const docs = await Club.find(); // ✅ No callback
    res.render('home', { clubs: docs });
  } catch (err) {
    console.error("Error fetching data from database:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Add new club
router.post('/add', async (req, res) => {
  const { name, players, coach } = req.body;
  console.log(name, players, coach);

  const newClub = new Club({ name, players, coach });

  try {
    await newClub.save();
    console.log("Data saved successfully");
    res.redirect('/');
  } catch (err) {
    console.log("Something went wrong while saving to the database");
    res.status(500).send("Failed to save data");
  }
});

// Edit club - load edit form
router.get('/edit/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id); 
    if (!club) {
      return res.status(404).send("Club not found");
    }
    res.render('edit', { club }); 
  } catch (err) {
    console.log("Error fetching club for edit:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Update club - save edited data
router.post('/update/:id', async (req, res) => {
  try {
    const updatedClub = await Club.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedClub) {
      return res.status(404).send("Club not found for update");
    }

    console.log("Data updated successfully");
    res.redirect('/');
  } catch (err) {
    console.log("Error updating club:", err);
    res.status(500).send("Internal Server Error");
    //res.render('edit', { Club }); // club = single club document

  }
});

//Route to edit element
router.post('/edit/:id', async (req, res, next) => {
  try {
    await Club.findByIdAndUpdate(req.params.id, req.body);
    console.log("Data updated successfully");
    res.redirect('/');
  } catch (err) {
    console.log("Something went wrong while updating the data");
    next(err);
  }
});

//route to delete club

// router.get('/delete/:id',  (req, res, next) => {
//     club.findByIdAndDelete({_id : req.params.id},(err,docs)=>{
//           if(err){
//            console.log("something went wrong to delete the data");
//            next (err);
//           }else{
//             console.log("Data deleted successfully");
//             res.redirect('/');
//           } 
//     });
// }); 



router.get('/delete/:id', async (req, res, next) => {
  try {
    await Club.findByIdAndDelete(req.params.id); // ✅ use Club and no callback
    console.log("Data deleted successfully");
    res.redirect('/');
  } catch (err) {
    console.log("Something went wrong while deleting the data");
    next(err);
  }
});



module.exports = router;
