// React
import React from 'react';
// GraphQL
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import TimeAgo from 'react-timeago'

// Bootstrap
const Label = require('react-bootstrap').Label;
const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Glyphicon = require('react-bootstrap').Glyphicon;
const Col = require('react-bootstrap').Col;
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Taggy = require('react-taggy').default
const Image = require('react-bootstrap').Image

// query to pass into
const getPullRequestsInfo = gql `
  query getPullRequestsInfo  ($login: String!){
  user(login:$login) {
    pullRequests(last: 100, states: [OPEN]) {
      nodes {
        commits(last: 100) {
          totalCount
          edges {
            node {
              id
              commit {
                message
              }
            }
          }
        }
        repository {
          name
        }
        title
        createdAt
        url
        comments(last: 100) {
          nodes {
            author {
              login
              url
            }
          }
          totalCount
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
}
`;

const withInfo = graphql(getPullRequestsInfo, {
    //pass in entered username
    options: ({ login }) => {
        return {
            variables: {
                login: login
            }
        }
    },
    props: ({ data }) => {
        // loading state
        if (data.loading) {
            return {
                loading: true
            };
        }

        // error state
        if (data.error) {
            console.error(data.error);
        }

        // OK state
        return {
            data
        };
    },
});

// Repository
class Repository extends React.Component {

    componentWillReceiveProps(newProps) {
        // DRY
        const pullRequests = newProps.data.user.pullRequests;

        // states
        this.setState({
            prs: pullRequests
        });
    }

    render() {
        const {
            loading
        } = this.props;
        if (!loading) {
            var requests = (this.state) ? this.state.prs.nodes : this.props.data.user.pullRequests.nodes;
            var requestComponents = requests.map(function(request) {
                return <PullRequest key = {request.title} title = {request.title} comments = {request.comments.nodes}
                  repository = {request.repository.name} createdAt = {request.createdAt}/>;
            });
        }
        return (!loading &&
          <div className = "container2 container3">
            <ul> {requestComponents} </ul>
          </div>
        )
    }
}

class PullRequest extends React.Component {
        componentWillMount() {
            this.setState({
                comments: this.props.comments,
                title: this.props.title,
                createdAt: new Date(this.props.createdAt),
                repository: this.props.repository
            })
        }

        render() {
                var { loading } = this.props;
                if (this.props.pr != null) {
                    loading = false;
                }

                var comments_text = 'Has anybody seen your PR?';
                const spansNo = [{ start: 0, end: 45, type: 'no' }]
                const spansYes = [{ start: 0, end: 45, type: 'yes' }]
                const entNo = [{
                    type: 'no',
                    color: { r: 252, g: 121, b: 132 }
                }]
                const entYes = [{
                    type: 'yes',
                    color: { r: 184, g: 235, b: 229 }
                }]
                var returnEnts = function(comments) {
                    var ent = (comments.length === 0) ? entNo : entYes;
                    return ent;
                }
                var returnSpans = function(comments) {
                    var spans = (comments.length === 0) ? spansNo : spansYes;
                    return spans;
                }
                var returnGlyph = function(comments) {
                    var glyph = (comments.length === 0) ? "eye-open" : "eye-close";
                    return glyph;
                }
                return (!loading &&
                  <div className = "card2">
                    <Grid>
                      <Row>
                        <Col xs = {12} md = {10}>
                          <ListGroup>
                            <ListGroupItem header = {this.state.title} href = "https://google.com" active> ⤷ {this.state.repository} </ListGroupItem>
                            <ListGroupItem header = { <Glyphicon glyph = {returnGlyph(this.state.comments)}/>}>
                              <div className = "taggo"><Taggy text={comments_text} spans={returnSpans(this.state.comments)} ents={returnEnts(this.state.comments)} /></div>
                            </ListGroupItem>
                            <ListGroupItem><Glyphicon glyph = "comment"/> Comments <Label> { this.state.comments.length } </Label></ListGroupItem>
                            <ListGroupItem> <Glyphicon glyph = "time"/> First Opened <TimeAgo date = {this.state.createdAt}/></ListGroupItem>
                          </ListGroup></Col> <Col xs = {12} md = { 2 }>
                          <Image height = "70%" width = "100%" className = "image" src = "https://png.icons8.com/?id=45106&size=280" alt = "" />
                       </Col>
                     </Row>
                  </Grid>
                </div>)
                }
}

                const RepositoryWithInfo = withInfo(Repository);
                export default RepositoryWithInfo;
