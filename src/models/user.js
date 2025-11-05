const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50
        },
        lastName: {
            type: String,
            minLength: 4,
            maxLength: 50
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("This is not a valid email!");
                }
            }
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter a strong password");
                }
            }
        },
        age: {
            type: Number
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender data is not valid!");
                }
            }
        },
        photoUrl: {
            type: String,
            
        },
        about: {
            type: String,
            default: "This is the default description!"
        },
        skills: {
            type:[String]
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', function (next) {
    if (!this.photoUrl) {
    if (this.gender === "male") {
      this.photoUrl = "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png";
    } else if (this.gender === "female") {
      this.photoUrl = "https://static.vecteezy.com/system/resources/previews/042/332/098/large_2x/default-avatar-profile-icon-grey-photo-placeholder-female-no-photo-images-for-unfilled-user-profile-greyscale-illustration-for-socail-media-web-vector.jpg";
    } else {
      this.photoUrl = "https://thumbs.dreamstime.com/b/user-profile-vector-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-user-profile-vector-flat-304778094.jpg?w=768";
    }
  }
  next();
});

userSchema.methods.getJWT = function () {
        const user = this;
        const token = jwt.sign({ _id: user._id }, "topSecret");
        return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(passwordInputByUser, hashedPassword);
    return isValidPassword;
}

module.exports = mongoose.model('User', userSchema);