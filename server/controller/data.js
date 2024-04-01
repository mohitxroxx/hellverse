const express = require("express");
const Data = require("../models/data");
const Team = require("../models/team");
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express();

app.post('/add', async (req, res) => { //route to add the json data to into the mongo db to perform the given operations
  try {
    const raw = fs.readFileSync('./heliverse_mock_data.json')
    const jsonData = JSON.parse(raw)
    jsonData.forEach(async (item) => {
      const payload = new Data(item);
      await payload.save();
    });
    return res.status(200).json({ msg: "Data added for operations" })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ err: "Internal server error" })
  }
})

app.get('/users', async (req, res) => { //route to retrieve all users with pagination support
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const allData = await Data.find({}).sort({ id: 1 }).skip(skip).limit(limit);
    return res.status(200).json(allData)
  } catch (error) {
    console.error(error)
    return res.status(400).json({ err: "Internal server error" })
  }
})

app.get('/users/:id', async (req, res) => { //route to details of particular user by id
  try {
    const id = req.params.id
    // console.log(id)
    const userData = await Data.findOne({ id });
    if (!userData)
      return res.status(404).json({ msg: "No data found" })
    return res.status(200).json(userData)
  } catch (error) {
    console.error(error)
    return res.status(400).json({ err: "Internal server error" })
  }
})

app.get('/filter', async (req, res) => { //route to perform various filters
  try {
    const name = req.query.name
    if (name) {
      const splitName = name.split(" ")
      const first_name = splitName[0]
      const last_name = splitName.length > 1 ? splitName[1] : ''
      const data = await Data.findOne({ first_name, last_name })
      if (data)
        return res.status(200).json(data)
      return res.status(404).json({ msg: "No data found for this name" })
    }
    const _id = req.query.objID
    if (_id) {
      const data = await Data.findOne({ _id })
      if (data)
        return res.status(200).json(data)
      return res.status(404).json({ msg: "No data found for this userID" })
    }
    const domain = req.query.domain
    const available = req.query.available
    console.log(available)
    const gender = req.query.gender
    if (!domain && !available && gender) {
      const data = await Data.find({ gender })
      return res.status(200).json(data)
    }
    if (!domain && available && !gender) {
      const data = await Data.find({ available })
      return res.status(200).json(data)
    }
    if (domain && !available && !gender) {
      const data = await Data.find({ domain })
      return res.status(200).json(data)
    }
    else
      return res.status(400).json({ err: "domain, available status or gender is required to filter data" })

  } catch (error) {
    console.error(error)
    return res.status(400).json({ err: "Internal server error" })
  }
})

app.post('/users', async (req, res) => { //route to add user to the db
  try {
    const allData = await Data.find({}).sort({ id: -1 });
    // console.log(allData[0].id)
    const { first_name, last_name, email, gender, avatar, domain, available } = req.body
    if (!first_name || !last_name || !email || !gender || !avatar || !domain || !available)
      return res.status(400).json({ err: "you need to enter all the necessary information!" })

    const dataTosave = {
      id: allData[0].id + 1,
      ...req.body
    }

    const payload = new Data(dataTosave);
    await payload.save();

    return res.status(200).json({ msg: "Data added" })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ err: "Internal server error" })
  }
})

app.post('/users/:id', async (req, res) => { //route to patch the data particular user by id
  try {
    const id = req.params.id
    // console.log(id)
    const userData = await Data.findOne({ id });
    if (!userData)
      return res.status(404).json({ msg: "No data found" })
    const { first_name, last_name, email, gender, avatar, domain, available } = req.body
    const updatedData = await Data.findOneAndUpdate({ id }, {
      first_name: first_name ? first_name : userData.first_name,
      last_name: last_name ? last_name : userData.last_name,
      email: email ? email : userData.email,
      gender: gender ? gender : userData.gender,
      avatar: avatar ? avatar : userData.avatar,
      domain: domain ? domain : userData.domain,
      available: available ? available : userData.available
    }, { new: true });
    return res.status(200).json({ msg: "Data Updated", updatedData })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ err: "Internal server error" })
  }
})
app.delete('/users/:id', async (req, res) => { //route to delete the data of particular user by id
  try {
    const id = req.params.id
    // console.log(id)
    const userData = await Data.findOne({ id });
    if (!userData)
      return res.status(404).json({ msg: "No data found" })
    const updatedData = await Data.findOneAndDelete({ id });
    return res.status(200).json({ msg: "Data deleted", updatedData })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ err: "Internal server error" })
  }
})

app.post('/team', async (req, res) => { //route to create a team
  try {
    const { cart } = req.body;
    const team = new Team();
    const domains = new Set();

    for (let id of cart) {
      const user = await Data.findOne({ id, available: true });

      if (!user) {
        return res.status(400).json({ err: `User with id ${id} not found or not available` });
      }

      if (domains.has(user.domain)) {
        return res.status(400).json({ err: `Domain ${user.domain} already exists in the team` });
      }

      domains.add(user.domain);
      team.members.push(user._id);
    }

    team.domains = Array.from(domains);
    await team.save();
    return res.status(200).json({ msg: "Team created", team });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  }
})
app.get('/team', async (req, res) => { //route to view all teams
  try {
    const data = await Team.find({})
    if (!data)
      return res.status(404).json({ msg: "No data found" })
    return res.status(200).json({ data });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  }
})
app.get('/team/:id', async (req, res) => { //route to view a particular team
  try {
    const _id = req.params.id
    const data = await Team.findOne({ _id })
    if (!data)
      return res.status(404).json({ msg: "No data found" })
    return res.status(200).json({ data });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal server error" });
  }
}) 
module.exports = app;
