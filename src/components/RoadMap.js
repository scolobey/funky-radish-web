import React, { Component } from 'react';

class RoadMap extends Component {
  render() {
    return (
      <div className="RoadMapContainer">
        <div className="RoadMap">
          <ul>
            <li key='1'>
              Automatic saving
            </li>
            <li key='2'>
              Ingredient checklist
            </li>
            <li key='3'>
              Bulk recipe import
            </li>
            <li key='4'>
              Recipe sharing
            </li>
          </ul>
        </div>
      </div>

    );
  }
}

export default RoadMap;
