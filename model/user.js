const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, required: false},
    email: {type:String,unique: true,required: true},
    password: { type: String},
    address: { type: String},
    loginAttempts: { type: Number, required: false, default: 0 },
    lockUntil: { type: Number, required: false, default: 0 },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
