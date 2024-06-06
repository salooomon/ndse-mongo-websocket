const { Schema, model } = require('mongoose');

const messageSchema = new Schema(
    {
        bookid: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            default: null,
        }
    },
    {
        versionKey: false,
        timestamps: true
    },
);

module.exports = model('message', messageSchema);