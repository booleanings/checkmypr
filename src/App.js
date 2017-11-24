// React
import React, { Component } from 'react'

// Apollo
import { ApolloProvider } from 'react-apollo'

import {Panel, Form, FormGroup, FormControl, Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { Icon} from 'react-materialize'

// Load locale specific relative date/time messages
//
import javascriptTimeAgo from 'javascript-time-ago'

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
// http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
//


// Auth
import { login } from './githubLogin'
import { username, password } from './config'

// App.Components
import Repository from './repository'
require('javascript-time-ago/intl-messageformat-global')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')
javascriptTimeAgo.locale(require('javascript-time-ago/locales/en'))
javascriptTimeAgo.locale(require('javascript-time-ago/locales/ru'))
// Global.Auth
let TOKEN = null

// Global.Apollo
const networkInterface = createNetworkInterface('https://api.github.com/graphql')
networkInterface.use([
  {
    applyMiddleware (req, next) {
      if (!req.options.headers) {
        req.options.headers = {} // Create the header object if needed.
      }

      // Send the login token in the Authorization header
      req.options.headers.authorization = `Bearer ${TOKEN}`
      next()
    }
  }
])

const client = new ApolloClient({
  networkInterface
})

// App
export default class App extends Component {
  constructor (props) {
    super()
    this.state = { login: false, login2: false }
  }

  componentDidMount () {
    if (username === 'xxx') {
      throw new Error('Please create a config.js your username and password.')
    }
    login(username, password).then(token => {
      TOKEN = token
      this.setState({ login: true })
    })
  }

  routeForRepository (login, name) {
    return {
      title: `${login}/${name}`,
      component: Repository,
      login,
      name
    }
  }
  onChangeUser(event, value){
      this.setState({ username: event.target.value});
  }
  onSubmitUser(event) {
      this.setState({login2: true})
  }
  changeUser(event) {
    this.setState({login2: false})
  }
  render () {
    // Log in state
    if (!this.state.login || !this.state.username || !this.state.login2) {
      return<div><div className="loginForm"><Panel className="card2" header="Welcome to CheckMyPR" bsStyle="primary">
      <ListGroup fill>
      <ListGroupItem header="What is this?">This app uses React, Redux, and the Github GraphQL to help keep
      Github users posted on the status of their open pull requests. Just enter a username to get started.</ListGroupItem>
      <ListGroupItem header="Try it out" >
      <Form inline>

          <FormGroup className="ui" controlId="formInlineName">
        <FormControl className="userInput " onBlur={this.onChangeUser.bind(this)}  type="username" placeholder="username" />
   </FormGroup>
   {' '}
  <Button bsStyle="primary" active className="userInput" onClick={this.onSubmitUser.bind(this)} type="submit">
     Submit
   </Button>
        </Form></ListGroupItem>
        </ListGroup>

    </Panel></div>
</div>
    }

    // Logged in, fetch from Github
    return (this.state.login && (this.state.username !== null) && this.state.login2)
      ?<div>
      <Button active onClick={this.changeUser.bind(this)}>Change user<Icon left>subdirectory_arrow_left</Icon></Button>
      <ApolloProvider client={client}>
        <Repository {...this.routeForRepository(this.state.username, 'react')} />
      </ApolloProvider></div>
      : <p>Logging in...</p>

  }
}
