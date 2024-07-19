const mongoose = require("mongoose");
const { Schema } = mongoose;

const listSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: true,
        default: "Untitled List"
    },
    todos: [ {
        type: Schema.Types.ObjectId,
        ref: "todos"
    } ],
    isDefaultTasksList: {
        type: Boolean,
        default: false
    }
})

const todolists = mongoose.model("todolists", listSchema);

module.exports = { todolists };