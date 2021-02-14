module.exports = {
    validate: ({ firstName, lastName, phone, age, address, userName }) => {
        return firstName 
            && lastName 
            && phone 
            && phone.length === 10 
            && age 
            && age < 120 
            && age > 13 
            && address
            && userName
    },
    validateEdit: ({ firstName, lastName, phone, age, address }) => {
        return (!phone 
            || phone.length === 10) && (!age 
            || (age < 120 
            && age > 13))
    }
}