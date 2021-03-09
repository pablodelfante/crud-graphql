import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import peoples from './peoples.js';
import connect from './database.js';
import People from './models/people.js';

const app = express();
connect();

// cuando es un array se debe especificar [elem,...]
// basicamente eso son schemas de grapshql
//puedo especificar si son: input Ejemplo, type Mutation, type Query etc
var schema = buildSchema(`
    type Query {
       hello:String
       peoples: [People]
    }
    type People{
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
    }
`);
/* type Query {
    getMessage(id: ID!): Message
} */

var root = {
    // saludo simple
    hello: () => { return 'cuando hago una query con hello me retorna esto' },
    peoples: async () => {
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
        console.log(_id)
        return await People.findByIdAndDelete(_id);
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