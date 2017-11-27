## CheckMyPR

A Node.js app using Github's GraphQL API to check up on any user's pull requests. 



### Getting Started

#### Prerequisites

To build the project, you will need `Node.js` installed. Once you have installed node, just clone and install dependencies and run using:

```shell
git clone "https://github.com/aidaekay/checkmypr.git"
cd checkmypr
npm i && npm start
```

Open the client at https://localhost:3000 and click "Login with Github" to login. Once you have logged in, just type in any user to get their open pull requests.



### Built With

* Node.js: running and dependency manager
* React
* Apollo & Github's GraphQL



### React Components / API Reference

There are several main React components this application uses: `App.js`, `githubLogin.js` , and `repository.js`. 

##### App.js

The `App.js` component simply wraps all of the included components within the code.  It takes in the prop of state, login, component, and name. The `state.username` holds the username of the person to be searched for and passes it into the contained `Repository` prop and component. The login state holds whether a person is logged in for the graph calls to work, while the login2 state checks whether a username has been entered to search for.

##### Repository.js

The `repository` component mainly just holds a list of pull request IDs, found with the call to graphql in the `withInfo` object while the `loading` prop tracks whether all data has been loaded. The `render()` function of this component just creates a series of `PullRequest` components based on the data retrieved.

##### PullRequest.js

The `PullRequest` component mainly takes in a series of pull request object and renders them into a pretty little bootstrap container that displays the time ago, number of comments, etc.



### Contributing

If somehow you find this project and want to contribute, it would be *much* appreciated. Some issues are open with things that should probably be fixed. Feel free to just open a PR and I will look at it when I get a chance.



### Acknowledgements

This project was largely based on and used this lovely repo as a foundation `https://github.com/katopz/react-apollo-graphql-github-example` as well as this repo for reference `https://github.com/apollographql/GitHunt-React`. 

Big thank you to the amazing people who wrote the documentation for Apollo, React, Node.js and everything in between.
