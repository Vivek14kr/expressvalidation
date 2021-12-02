const app = require("./app");
const connect = require("./config/db")


app.listen(2134, async function () {
    await connect();
    console.log("listening")
})