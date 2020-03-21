var admin = require("firebase-admin");
var serviceAccount = require("../website-ngo98-firebase-adminsdk-vxw7y-0b58171e63.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cafeteria-5ad49.firebaseio.com",
    storageBucket: "cafeteria-5ad49.appspot.com",
    projectId: 'cafeteria-5ad49'
});

const db = admin.firestore();

var bucket = admin.storage().bucket();

module.exports = {
    db: db,
    bucket: bucket
}
