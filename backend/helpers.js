const bcrypt = require('bcrypt');
module.exports = {
    generateHash: (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    cleanupUser: (user) => {
        if (user.hasOwnProperty("password")) delete user.password;
        if (user.hasOwnProperty("createdAt")) delete user.createdAt;
        if (user.hasOwnProperty("updatedAt")) delete user.updatedAt;
        if (user.hasOwnProperty("deletedAt")) delete user.deletedAt;
        if (user.hasOwnProperty("id")) delete user.id;
        return user;
    }
}