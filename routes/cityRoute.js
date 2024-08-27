import express, { response } from "express";

import { City } from "../models/cityModel.js";

const router = express.Router();

//ADD CITY API
router.post("/addCity", async (req, res) => {
  const { name, population, country, latitude, longitude } = req.body;
  try {
    if (!name || !population || !country || !latitude || !longitude) {
      return res.status(400).send({
        message: "Send All Required Fields",
      });
    }

    const newCity = {
      name: name,
      population: population,
      country: country,
      latitude: latitude,
      longitude: longitude,
    };

    const cityAlreadyExists = await City.findOne({ name });
    if (cityAlreadyExists === null) {
      const city = await City.create(newCity);
      res.status(200).send(city);
    } else {
      res.status(400).send("City already exists");
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

//UPDATE CITY API
/*Here Im updating City based on Old Name, We can also use id attribute inplace of oldName to update the City Details.
 We use old Object Id in new JSON Obj Id, its very lengthy process so i used the name as Identifier */

router.put("/updateCity", async (req, res) => {
  const { oldName, name, population, country, latitude, longitude } = req.body;
  try {
    if (
      !oldName ||
      !name ||
      !population ||
      !country ||
      !latitude ||
      !longitude
    ) {
      res.status(400).send({ message: "Send All Required Fields" });
    }

    const updatedCityObj = {
      name: name,
      population: population,
      country: country,
      latitude: latitude,
      longitude: longitude,
    };

    const dbCity = await City.findOne({ name: oldName });
    if (dbCity === null) {
      res.status(404).send({ message: "No City Found" });
    } else {
      await City.updateOne({ name: oldName }, updatedCityObj);
      res.status(200).send({ message: "Updated City Successfully" });
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

//DELETE CITY API

router.delete("/deleteCity", async (req, res) => {
  const { name } = req.body;
  try {
    const dbCity = await City.findOne({ name: name });
    if (dbCity === null) {
      res.status(404).send("City not found");
    } else {
      await City.deleteOne({ name: name });
      res.status(200).send("City deleted successfully");
    }
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

//GET CITY API
/* Sorting based on population, matching with country, limit as number of cities */

router.get("/getCity", async (req, res) => {
  const { limit, country } = req.body;
  try {
    if (!limit || !country) {
      res.status(400).send({ message: "Send All Required Fields" });
    }
    const data = await City.find({ country })
      .limit(limit)
      .select({ name: 1, country: 1, population: 1 })
      .sort({ population: -1 })
      .exec();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

export default router;
