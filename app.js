const express = require('express')
const app = express();
var cors = require('cors')
app.use(cors())   
app.use('/apidoc', express.static('apidoc'));
const user = require('./routes/user.js')
const announcement = require('./routes/announcement.js')
const institute = require('./routes/institute.js')
const resource = require('./routes/resource.js')

app.use('/user', user);
app.use('/announcement', announcement);
app.use('/institute', institute);
app.use('/resource', resource);

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

module.exports.app = app;