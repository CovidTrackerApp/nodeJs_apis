const LocalStrategy = require("passport-local").strategy;
const client = require("./db");
const bcrypt =  require("bcrypt");

function initialize(passport) {
    const authenticateUser = (uname, password, done) => {
        client.query("SELECT * FROM users WHERE uname = $1", [uname], (err, results) => {
            if (err) {
                throw err;
            }

            console.log(results.rows);
            if (results.rows.length > 0) {
                const user = results.rows[0];
                
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }

                    if (isMatch) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, {message: "passport is not correct"});
                    }
                });
            } else {
                return done(null, false, {message: "Email is not registered"});
            }
        }
        )
    };
    
    passport.use(
        new LocalStrategy(
            {
                usernameField : "uname",
                passwordField : "password"
            },
        authenticateUser
       )
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((uname, done) => {
        client.query(
            "SELECT * from users WHERE uname = $1", [uname], (err, results) => {

            }
        )
    })
}