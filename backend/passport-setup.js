const { generateHash } = require('./helpers');
const fsx = require('fs-extra');
const uuid = require('uuid');
const isBase64 = require('is-base64');
const validators = require('./validators');
const bcrypt= require('bcrypt');
const env = require('./env');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

module.exports = async (passport, user) => {

    const User = user;
    const LocalStrategy = require('passport-local').Strategy;

    passport.use('signup', new LocalStrategy({
            usernameField: 'userName',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req, userName, password, done) => {
            const user = await User.findOne({
                where: {
                    userName: userName
                }
            });
            if (user) {
                return done(null, false, {
                    message: 'That username is already taken'
                });
            } else {
                if(!validators.validate(req.body)) return  done(null, false, { message: 'Invalid Request' });
                const userPassword = generateHash(password);
                const base64String = req.body.profileImage;
                let imageName = "";
                if(base64String && isBase64(base64String, { mimeRequired: true })) {
                    let profileImage = base64String.split(';base64,').pop();
                    imageName = uuid.v4();
                    try {
                        await fsx.writeFile(`./images/${imageName}.png`, profileImage, { encoding: 'base64' })
                    } catch(e) {
                        return done(null, false, {
                            message: 'Image upload failed'
                        });
                    }
                }
                const data = {
                    userName: userName,
                    password: userPassword,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    age: req.body.age,
                    address: req.body.address,
                    phone: req.body.phone,
                    profileImage: imageName,
                };
                User.create(data).then((newUser) => {
                    if (!newUser) return done(null, false);
                    if (newUser) return done(null, newUser)
                });
            }
        }
    ));
    
    passport.use('login', new LocalStrategy({
            usernameField: 'userName',
            passwordField: 'password',
            passReqToCallback: true
          },
          async (req, userName, password, done) => {
            try {
                const user = await User.findOne({ where: { userName } });
                if (!user) return done(null, false, { message: 'User not found', deletedAt: null });

                const validate = await bcrypt.compare(password, user.password);
                if (!validate) return done(null, false, { message: 'Wrong Password' });
        
                return done(null, user.dataValues, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
          }
        )
    );

    passport.use(new JWTstrategy({
            secretOrKey: env.secret,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                const user = await User.findOne({ where: { id: token.user.id, deletedAt: null }});
                return done(null, user);
            } catch (error) {
                done(error);
            }
        })
    );   
}