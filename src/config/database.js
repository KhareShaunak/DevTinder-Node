const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://dbShaunak:ShaunakKhare@namastenode.0igpkao.mongodb.net/devTinder?tls=true');
}

module.exports = connectDB;