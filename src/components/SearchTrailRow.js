import React from 'react';
import TrailService from '../services/TrailService'

let trailService = new TrailService()

export default function SearchTrailRow(props) {
  let path = window.location.pathname
  let config = props.config
  let query = props.query

  let trailMap = trailService.build(config, query)

  return (
    <div className="search-trail">
      {trailMap}
    </div>
  );
}
