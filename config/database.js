const mongoose = require("mongoose")
mongoose.Promise = global.Promise

mongoose.connect("mongodb://0.0.0.0:27017/products", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))