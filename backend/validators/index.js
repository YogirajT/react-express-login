const Validator = require('jsonschema').Validator;

const v = new Validator();
const userModel = {
    id : "/User",
    type : "object",
    properties : {
        userName: { type: "string", minLength: 1, maxLength: 50},
        password: { type: "string",  minLength: 6, maxLength: 16},
        firstName: { type: "string",  minLength: 1, maxLength: 50},
        lastName: { type: "string",  minLength: 1, maxLength: 50},
        phone: { type: "string",  minLength: 10, maxLength: 10},
        age: { type: "integer", minimum: 13, maximum: 120},
        address: { type: "string"},
        profileImage: { anyOf : [
            { type: "string" }, 
            { type: "null" }
        ]},
    },
    required: ["userName", "password", "firstName","lastName","phone","age","address"]
};

const editModel = {
    id : "/Edit",
    type : "object",
    properties : {
        firstName: { type: "string",  minLength: 1, maxLength: 50},
        lastName: { type: "string",  minLength: 1, maxLength: 50},
        phone: { type: "string",  minLength: 10, maxLength: 10},
        age: { type: "integer", minimum: 13, maximum: 120},
        address: { type: "string"},
        profileImage: { anyOf : [
            { type: "string" }, 
            { type: "null" }
        ]},
    },
    required: []
};

module.exports = {
    userValidator: (user) => v.validate(user, userModel),
    editValidator: (edit) => v.validate(edit, editModel)
}

