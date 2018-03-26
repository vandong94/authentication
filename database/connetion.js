var mongoose = require('mongoose');


var conn = mongoose.connection;
conn.on('connected', function(err, conn) {
    if (err) throw Error('Database can not connected');
    console.log('Mongoose connected');
    app.listen(3000, () => {
        console.log("Server is running on port 3000!");
    });
});
mongoose.connect("mongodb://localhost/loginapp");

module.exports = conn;