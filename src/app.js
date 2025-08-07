const express =require('express')

const app = express();

app.use("/hello",(req, res) => { // this callback function is called as req handler
    res.send("Hello Mr. NILESH JI from the dashboard");
})

app.use("/test",(req, res) => { 
        res.send("Hello from the server");
})

app.use("/",(req, res) => { 
        res.send("Hello Mr. ANKIT UPA");
})


app.listen(7777, () => {
    console.log("Server successfully started or listening on port no. 7777")
})