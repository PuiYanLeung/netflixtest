require('dotenv').config();
const mongoose = require('mongoose');

const fs = require('fs');
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const connection = mongoose.connection

connection.once("open", () => {
    console.log("Welcome to Netflix App")
})

const Film = mongoose.model(
    'Film',
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        genre: {
            type: String
        },
        language: {
            type: String
        },
        age: {
            type: Number
        }
    }
)

const main = async () => {

    if (argv.add) {

        try {
            // if (argv.add != null) {
            //     if (argv.genre == null) {
            //         argv.genre = "N/A"
            //     }
            //     if (argv.lang == null) {
            //         argv.lang = "N/A"
            //     }
            //     if (argv.age == null) {
            //         argv.age = 99
            //     }
            // }
            const movie_add = new Film({ title: argv.add, genre: argv.genre, language: argv.lang, age: argv.age })
            await movie_add.save()
            console.log(`Adding: ${movie_add}`)
        } catch (error) {
            console.log(`Can't add ${argv.title}, already exists!`)
        }

    } else if (argv.delete) {

        const res = await Film.deleteOne({ title: argv.delete })
        //const res = await Film.deleteOne({ _id: argv.delete })
        console.log(`${res.deletedCount} record(s) deleted`)

    } else if (argv.edit) {
        const movie_edit = await Film.updateOne({ title: argv.edit }, { $set: { title: argv.replace } })
        console.log(`${movie_edit.nModified} record(s) updated`)

    } else if (argv.list) {
        console.log(await Film.find({}))
    } else {
        console.log("Invalid option")
    }
    process.exit()
}

main()

