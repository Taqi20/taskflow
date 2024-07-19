const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoStepsScehma = new Schema({
    stepTitle: {
        type: String
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

const todoScehma = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    todolists: {
        type: Schema.Types.ObjectId,
        ref: "todolists"
    },
    title: {
        type: String,
        required: true,
    },
    steps: {
        type: [ todoStepsScehma ],
    },
    note: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    markedImp: {
        type: Boolean,
        default: false
    },
    inMyDay: {
        type: Boolean,
        default: false
    }
})

const todo = mongoose.model("todos", todoScehma);

module.exports = { todo };