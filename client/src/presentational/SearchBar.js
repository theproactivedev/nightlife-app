import React, { Component } from 'react';

class SearchBar extends Component {
  render() {
    return(
      <div>
      <div className="row">
        <div className="col-sm-12 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6">
          <form method="POST" onSubmit={this.props.onSubmit}>
            <div className="form-group">
              <input type="text" id="searchBar" name="searchBar" className="form-control" onChange={this.props.onChange} placeholder="Where are you?" value={this.props.place} />
            </div>
            <div className="form-group">
              <input type="submit" value="Go" id="submitBtn" className="btn btn-primary pull-right" />
            </div>
          </form>
        </div>
      </div>
      </div>
    );
  }
}

export default SearchBar;
