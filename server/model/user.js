const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
//   author: ObjectId,
username: {
    type: String,
    require: true,
    max:[60, 'ユーザ名は最大６０文字までです']
},
email: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
    max:[60, 'Eメールは最大６０文字までです']
},
password: {
    type: String,
    require: true,
    min:[6, 'パスワードは６文字以上で入力してください'],
    max:[30, 'パスワードは最大３０文字までです']
},
});

UserSchema.methods.hasSamePassword = function(inputPassword) {
    const user = this
    return bcrypt.compareSync(inputPassword, user.password)
}

UserSchema.pre("save", function(next) {
    const user = this
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            // Store hash in your password DB.
            user.password = hash
            next()
        });
    });
})

module.exports = mongoose.model('User', UserSchema )