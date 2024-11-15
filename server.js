/********************************************************************************
* WEB700 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: John Clarence C. Husenia Student ID: 174280230 Date: November 14, 2024
*
* Published URL: https://web100test1.vercel.app/
*
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const fs = require('fs');

const HTTP_PORT = process.env.PORT || 8080;


// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

app.use(express.json());


app.get("/", (req,res)=>{
    res.render("home");

});

app.get("/about", (req,res)=>{
    res.render("about");

});

app.get("/test", async (req,res)=>{
    res.render("test1");
});



app.get("/lego/addSet",  async (req,res)=>{

    
    try {
        const themeSets = await legoData.getAllThemes();
        res.render("addSets", {themes: themeSets});

    } catch (error) {
        console.error(error);
        res.render("404");
    }
});

app.get("/lego/sets", async (req,res)=>{
    const theme = req.query.theme;
    try {
        const themeSets = await legoData.getSetsByTheme(theme)
        res.render("sets", {sets: themeSets}); 
    } catch (error) {
        console.error(error);
        res.render("404");
    }
    
});

app.get('/lego/sets/:set_num', async (req, res) => {
    const setNum = req.params.set_num;
    try {
        const setNum1 = await legoData.getSetByNum(setNum);
        res.render("set", {set: setNum1}); 
    } catch (error) {
        console.error(error);
        res.render("404");
    }
});

app.post('/lego/addsets', async (req, res) => {
    console.log("running add");
    try {
        let foundTheme = await legoData.getThemeById(req.body.theme_id);
        req.body.theme = foundTheme
        const newObject = req.body;
        const addset = await legoData.legoaddset(newObject);
        res.render("set", {set: addset}); 
    } catch (error) {
        console.error("Failed to initialize LegoData:", err);
        res.status(422).send("Failed to initialize data after adding set.");
    }


});

app.get('/lego/deleteset/:set_num', async (req, res) => {
    const theme = req.query.theme;
    try{ 
        await legoData.legodeleteset(req.params.set_num); 
        // const themeSets = await legoData.getSetsByTheme(theme)
        // res.render("sets", {sets: themeSets}); 
        res.redirect("/lego/sets"); 
        }catch(err){ 
        res.status(404).send(err); 
        }
});

// next lines will be dealing with files

app.get("/fsets", async (req,res)=>{
    const theme = req.query.theme;
    try {
        const themeSets = await legoData.getSetsByTheme(theme)
        res.render("fsets", {sets: themeSets}); 
    } catch (error) {
        console.error(error);
        res.render("404");
    }
    
});

app.get("/faddSet",  async (req,res)=>{

    
    try {
        const themeSets = await legoData.getAllThemes();
        res.render("faddSet", {themes: themeSets});

    } catch (error) {
        console.error(error);
        res.render("404");
    }
});

app.get('/fset/:set_num', async (req, res) => {
    const setNum = req.params.set_num;
    try {
        const setNum1 = await legoData.getSetByNum(setNum);
        res.render("fset", {set: setNum1}); 
    } catch (error) {
        console.error(error);
        res.render("404");
    }
});

app.post('/addsets', async (req, res) => {
    console.log("running add");
    try {
        let foundTheme = await legoData.getThemeById(req.body.theme_id);
        req.body.theme = foundTheme
        const newObject = req.body;
        const addset = await legoData.addsets(newObject);
        res.render("fset", {set: addset}); 
    } catch (error) {
        console.error("Failed to initialize LegoData:", err);
        res.status(422).send("Failed to initialize data after adding set.");
    }


});
app.get('/deleteset/:set_num', async (req, res) => {
    const theme = req.query.theme;
    try{ 
        await legoData.deleteSet(req.params.set_num); 
        // const themeSets = await legoData.getSetsByTheme(theme)
        // res.render("sets", {sets: themeSets}); 
        res.redirect("/fsets"); 
        }catch(err){ 
        res.status(404).send(err); 
        }
});

// this is the end file alteration

// 404 handler for any undefined routes
app.use((req, res) => {
    res.render("404");
});

async function startServer() {
    try {
        await legoData.initialize(); 
        console.log("Initialization complete. Starting server...");
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    } catch (error) {
        console.error("Failed to initialize:", error);
    }
}

startServer();