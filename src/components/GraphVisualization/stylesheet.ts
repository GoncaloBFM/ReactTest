export const stylesheet = [
  {
    selector: 'core',
    style: {
      'selection-box-opacity': 0,
      'active-bg-opacity': 0,
    }
  }, {
    selector: 'node',
    style: {
      'overlay-opacity': 0,
      shape: 'ellipse',
      width: 10,
      height: 10,
    }
  }, {
    selector: 'edge',
    style: {
      'overlay-opacity': 0,
      'font-size': 3,
      'curve-style': 'bezier',
      'edge-text-rotation': 'autorotate',
      "text-margin-x": "0px",
      "text-margin-y": "0px",
      'text-background-opacity': 1,
      'text-background-color': '#ddd',
      'text-background-shape': 'round-rectangle'
    }
  }, {
    selector: 'node[type="person"]',
    style: {
      'background-color': '#922',
      label: 'data(name)',
      'font-size': 3
    }
  }, {
    selector: 'node[type="account"]',
    style: {
      'background-color': '#292',
      label: 'data(id)',
      'font-size': 3
    }
  }, {
    selector: 'edge[type="transaction"]',
    style: {
      label: 'data(type)',
      'target-arrow-shape': 'triangle',
      'width': 1,
      'line-color': '#000',
      'target-arrow-color': '#000',
      'source-arrow-color': '#000',
      'arrow-scale': 0.3,
    }
  }, {
    selector: 'edge[type="connection"]',
    style: {
      label: 'data(type)',
      'width': 2,
      'line-color': '#777',
      'line-style': 'dashed'
    }
  }, {
    selector: ':selected',
    css: {
      'background-color': 'SteelBlue',
      'line-color': 'black',
      'target-arrow-color': 'black',
      'source-arrow-color': 'black'
    }
  }
]


