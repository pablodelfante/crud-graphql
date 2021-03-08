import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import peoples from './peoples.js';

const app = express();
console.log(peoples)

// cuando es un array se debe especificar [elem,...]
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

    type Mutation {
        createPeople(input: PeopleInput): People
    }
    Input PeopleInput {
        name: String
        surname: String
        age: Int
    }
`);

var root = {
    hello: () => { return 'hola' },
    peoples: () => peoples,

    Mutation: {
        createPeople(_, {input}){
            return null
        }
    }
    
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(3000, () => {
    console.log('server online port 3000')
});