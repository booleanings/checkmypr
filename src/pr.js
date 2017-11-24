// React
import React from 'react';


// Repository
class PullRequest extends React.Component {
  constructor(props) {
    super(props);

    this.setState({
      pr: null;
    });
  }

  componentWillReceiveProps(newProps) {
    // DRY
    const request = newProps.pr;

    // states
    this.setState({
      pr: request
    });
  }

  render() {
    const { loading } = this.props;
    return (!loading &&
      <div>
      <h2>PR: {this.state.pr.title.toLocaleString()}</h2>
      <h4>Repository: {this.state.pr.repository}</h4>
      <ul>
        <li>Created At: {this.state.pr.createdAt.toLocaleString()}</li>
        <li>Number of Comments: {this.state.pr.comments.totalCount.toLocaleString()}</li>
      </ul>
    </div>)
  }
}



export default PullRequest;
