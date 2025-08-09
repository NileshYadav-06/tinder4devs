const express =require('express')

const app = express();



 
// this will handle GET call to /user
 app.get("/user", (req, res) => {
        res.send({firstname: "Nilesh", lastname: "Yadav"})
 })
app.post("/user", (req, res) => {
        console.log(" save data to database"); // we have to write the logic to save the data to DB
        res.send("Data succesfully saved to Database")
        
})
app.delete("/user", (req, res) => {
        res.send("Deleted successfully")
})
app.use("/user", (req, res) => {
        res.send("Haahahhahaa")
 })

//this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => { 
        res.send("Hello from the server ");
})


app.listen(7777, () => {
    console.log("Server successfully started or listening on port no. 7777")
})