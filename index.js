const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const app = express();
const PORT = process.env.PORT;
const corsMiddleware = require("./middleware/cors.middleware")
const filePathMiddleware = require("./middleware/filepath.middleware")
const fileUpload = require("express-fileupload")
const path = require("path")

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(filePathMiddleware(path.resolve(__dirname, "files")))
app.use(express.json())
app.use(express.static("static"))
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);
const start = async () => {

    try{
        await mongoose.connect(process.env.dbUrl)
        
        app.listen(PORT, () => {
            console.log("Server has been started on port:", PORT)
        })
        
    }catch(e) {
        
    }
}

start()
