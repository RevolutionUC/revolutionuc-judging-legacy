const fs = require('fs');
const util = require('util');
const path = require('path');
const express = require('express');
const router = express.Router();

const assigner = require('../lib/project-to-group-assignment');
const parser = require('../lib/devpost-export-parser');

const configFields = [
  'generalGroupCount', 'generalJudgesPerGroup',
  'generalGroupsPerProject', 'titleColumn',
  'categoryColumn', 'tableNumberColumn'
]

const intFields = ['generalGroupCount', 'generalJudgesPerGroup', 'generalGroupsPerProject']

/* GET home page. */
router.get('/', (req, res)=> {
  res.render('index', { main: 'form' });
});

router.post('/submit', async (req, res)=> {
  try {

    // saving csv data
    const file = req.files.dataFile;
    const uploadPath = path.join(__dirname, '..', 'uploads', 'data.csv');

    await util.promisify(file.mv)(uploadPath);

    // saving config data
    const configDefaults = {
      titleColumn: 'Submission Title',
      categoryColumn: 'Opt-in prize',
      tableNumberColumn: 'What Is Your Table Number?'
    }
    configFields.forEach(key => {
      if (req.body[key]) configDefaults[key] = req.body[key]
    });
    console.log({ configDefaults })
    const configPath = path.join(__dirname, '..', 'uploads', 'config.json');
    const configData = JSON.stringify(configDefaults)
    console.log({ configData })
    await util.promisify(fs.writeFile)(configPath, configData)

    res.status(200).send();
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get('/sheets', async (req, res)=> {
  try {

    const csvPath = path.join(__dirname, '..', 'uploads', 'data.csv')
    const csvBuffer = await util.promisify(fs.readFile)(csvPath)
    const csv = csvBuffer.toString()

    const jsonPath = path.join(__dirname, '..', 'uploads', 'config.json')
    const jsonBuffer = await util.promisify(fs.readFile)(jsonPath)
    const jsonString = jsonBuffer.toString()
    const config = JSON.parse(jsonString)
    intFields.forEach(key => {
      config[key] = parseInt(config[key])
    });

    const { Submissions, Categories } = parser(csv, config)
    const Groups = assigner(Submissions, config)
    
    res.render('index', { main: 'sheets', Groups, Submissions, Categories, config })
  } catch(err) {
    console.error(err)
    res.status(500).send()
  }
});

module.exports = router;
