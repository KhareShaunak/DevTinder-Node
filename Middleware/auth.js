const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked!")
    const token = "fakeToken";
    const isAuth = token === "wytwtwewefgweg"
    if (!isAuth) {
        res.status(401).send("Unauthorize request!");
    }
    else {
        next();
    }

};

const userAuth = (req, res, next) => {
    console.log("user auth is getting checked!")
    const token = "userToken";
    const isAuth = token === "userToken"
    if (!isAuth) {
        res.status(401).send("Unauthorize request!");
    }
    else {
        next();
    }

};

module.exports = { adminAuth, userAuth };