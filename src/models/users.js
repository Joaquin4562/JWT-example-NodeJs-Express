const  { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new Schema({
    username: String,
    email: String,
    password: String
});
userSchema.methods.encryptPass = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
};
userSchema,methods.validatePass = function (password) {
    return bcryptjs.compare(password, this.password);
}
module.exports = model('user', userSchema);