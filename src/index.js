import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import peoples from './peoples.js';

const app = express();

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
    }
`);

var root = {

    hello: () => { return 'cuando hago una query con hello me retorna esto' },
    peoples: () => {
        peoples//al consultar peoples retorna peoples
    },


    // mutaciones son para hacer modifiaciones

    createPeople({ input }) {
        peoples.push(input);
        console.log(peoples);
        return input;
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