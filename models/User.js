var mongoose = require('mongoose'); // mongodb module
var bcrypt = require('bcrypt-nodejs');
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var UserSchema = new Schema({ // define data fields
    name: {
        type: String,
        required: true,
        trim: true, // remove both-side white space
    },
    phone: {
        type: String,
        trim: true,
    },
    job: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true, // unique data lik PK
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'USER', // 'USER', 'ADMIN'
    },
    lastSignedIn: {
        type: Date,
    },
    // System fields
    isDeleted: {
        type: Boolean,
        default: false,
    },
    // Audit fields
    updated: {
        type: Date,
        default: Date.now,
    },
    inserted: {
        type: Date,
        default: Date.now,
    },
    updatedby: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    insertedby: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
});

/**
 * Hashing a password
 * before saving it to the database
 */
UserSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
    next();
});

/**
 * compare encrypted data
 * @param  {string} cleartext [description]
 * @param  {string} encrypted [description]
 * @return {boolean}           [description]
 */
UserSchema.statics.compare = function(cleartext, encrypted){
    return bcrypt.compareSync(cleartext, encrypted);
};

/**
 * Virtual field: updated date
 * @return {string} [description]
 */
UserSchema.virtual('updated_date').get(function() {
    return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

/**
 * Virtual field: inserted date
 * @return {string} [description]
 */
UserSchema.virtual('inserted_date').get(function() {
    return dateformat(this.inserted, 'dd/mm/yyyy HH:MM');
});
module.exports = mongoose.model('Users', UserSchema); // Users: collection name
