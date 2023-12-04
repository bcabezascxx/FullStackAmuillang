import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';



/*const httpLink = new HttpLink({
  uri: 'http://localhost:8090/api/graphql'
})*/

const httpLink = new HttpLink({
  uri: 'http://ec2-3-83-22-114.compute-1.amazonaws.com/api/graphql'
})



const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
