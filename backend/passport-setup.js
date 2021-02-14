const { generateHash } = require('./helpers');
const fsx = require('fs-extra');
const uuid = require('uuid');
const isBase64 = require('is-base64');
const bcrypt= require('bcrypt');
const env = require('./env');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { userValidator } = require('./validators');

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
                return done({
                    error: 'Username is already taken'
                }, false);
            } else {
                const validationResult = userValidator(req.body);
                if(validationResult.errors.length) return  done({ error: validationResult.errors.map(e => e.message).join(",") }, false);
                const userPassword = generateHash(password);
                const base64String = req.body.profileImage;
                let imageName = "";
                if(base64String && isBase64(base64String, { mimeRequired: true })) {
                    let profileImage = base64String.split(';base64,').pop();
                    imageName = uuid.v4();
                    try {
                        await fsx.writeFile(`./images/${imageName}.png`, profileImage, { encoding: 'base64' })
                    } catch(e) {
                        return done({
                            error: 'Image upload failed'
                        }, false );
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
                if (!user) return done(null, false, { error: 'User not found', deletedAt: null });

                const validate = await bcrypt.compare(password, user.password);
                if (!validate) return done(null, false, { message: 'Wrong Password' });
        
                return done(null, user.dataValues, { error: 'Logged in Successfully' });
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