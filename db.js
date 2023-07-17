const mongoose = require("mongoose")
mongoose.Promise = global.Promise

require("dotenv").config()

async function main() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@e-commerce.t6fqlrm.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("MongoDB connected")
    } catch (err) {
        console.log(err)
    }
}

main()

module.exports = main