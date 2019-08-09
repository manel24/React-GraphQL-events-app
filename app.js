const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const graphQlSchema = require('./graphql/schema')
const graphQlresolvers = require('./graphql/resolvers')
const isAuth = require('./middleware/is-auth')
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    }
    next();
})
app.use(isAuth)
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlresolvers,
    graphiql: true
}))
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@manel-cluster-8tc3w.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() =>
        app.listen(8000)
    ).catch(err => console.log(err))


