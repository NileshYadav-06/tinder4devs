const express =require('express');

const app = express();

// this will handle GET call to /user
 app.get("/user/:userId/:name/:password", (req, res) => {
        console.log(req.params);
        
    res.send({ firstname: "Nilesh", lastname: "Yadav" });
});

 

app.listen(7777, () => {
    console.log("Server successfully started or listening on port no. 7777")
})