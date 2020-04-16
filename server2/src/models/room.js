const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: String,
    icon: String,
}, {
    timestamps: true
});

module.exports = new mongoose.model("rooms", roomSchema);