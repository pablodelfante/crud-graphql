import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import peoples from './peoples.js';
import connect from './database.js';
import People from './models/People.js';

const app = express();
connect();

// cuando es un array se debe especificar [elem,...]
// basicamente eso son schemas de grapshql
//puedo especificar si son: input Ejemplo, type Mutation, type Query etc
var schema = buildSchema(`
    type Query {
       hello:String
       getPeoples: [People]
    }
    type People{
        _id:ID
        name: String
        surname: String
        age: Int
    }
    
    input PeopleInput {
        name: String
        surname: String
        age: Int
    }
    type Mutation {
        createPeople(input: PeopleInput): People
        deletePeople(_id: ID): People
        updatePeople(_id: ID, input: PeopleInput): People
    }
`);
/* type Query {
    getMessage(id: ID!): Message
} */

var root = {
    // saludo simple
    hello: () => { return 'cuando hago una query con hello me retorna esto' },
    getPeoples: async () => {
        const res = await People.find();
        return res//al consultar peoples retorna peoples
    },


    // mutaciones son para hacer modifiaciones
    async createPeople({ input }) {
        // peoples.push(input);
        const newPeople = new People(input);
        await newPeople.save();
        return newPeople;
    },

    async deletePeople({_id}){
        return await People.findByIdAndDelete(_id);
    },

    async updatePeople({_id, input}){
        const res = await People.findByIdAndUpdate(_id, input, {new:true});
        return res;
    }
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(3000, () => {
    console.log('server http://localhost:3000/graphql')
});