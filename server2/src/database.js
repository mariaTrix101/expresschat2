const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

module.exports = {
    Database: class Database {
        connect() {
            const defaultUri = 'mongodb://localhost:27017/expresschat2';
            const mongoDbUri = process.env.MONGODB_URI || defaultUri;
            mongoose.connect(mongoDbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
                .then(_ => {
                    console.log("Connected to the database")
                })
                .catch(err => {
                    console.log(err.message);
                    process.exit(0);
                });
        }
    },

    handle_result: function(err, data, callbackfn) {
        var hascallback = callbackfn !== undefined && callbackfn !== null;
        if (err) {
            console.log(err);
            if (hascallback) callbackfn(err, null);
        }
        else {
            // console.log(data);
            if (hascallback) callbackfn(null, data);
        }
    }
}