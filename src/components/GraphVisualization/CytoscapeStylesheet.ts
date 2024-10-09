export const CYTOSCAPE_STYLESHEET = [
    {
        selector: 'core',
        style: {
            'selection-box-opacity': 0,
            'active-bg-opacity': 0,
        }
    }, {
        selector: 'node',
        classes: [],
        style: {
            'overlay-opacity': 0,
            'font-size': 5,
            shape: 'ellipse',
            width: 10,
            height: 10,
            'text-background-color': '#eee',
            'text-background-shape': 'round-rectangle',
            'text-background-opacity': 1
        }
    }, {
        selector: 'edge',
        classes: [],
        style: {
            'overlay-opacity': 0,
            'font-size': 4,
            'curve-style': 'bezier',
            'edge-text-rotation': 'autorotate',
            "text-margin-x": "0px",
            "text-margin-y": "0px",
            'text-background-opacity': 1,
            'text-background-color': '#eee  ',
            'text-background-shape': 'round-rectangle'
        }
    }, {
        selector: 'node[type="person"]',
        style: {
            'background-color': '#922',
            'shape': 'round-octagon',
            label: 'data(name)',
        }
    }, {
        selector: 'node[expanded="true"]',
        style: {
            'border-position':'inside',
            'border-color':'black',
            'border-opacity': 1,
            'border-style': 'dotted',
            'border-width': 1,
        }
    }, {
        selector: 'node[type="account"]',
        style: {
            'background-color': '#292',
            label: 'data(id)',
        }
    }, {
        selector: 'edge[type="transaction"]',
        style: {
            label: 'data(label)',
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
            'width': 1,
            'line-color': '#777',
            'line-style': 'dashed'
        }
    }, {
        selector: '.manualEdgeSelect',
        css: {
            'line-color': 'SteelBlue',
            'width': 2,
            'arrow-scale': 0.5,
            'color': 'SteelBlue',
            'target-arrow-color': 'SteelBlue',
            'source-arrow-color': 'SteelBlue'
        }
    }, {
        selector: '.manualNodeSelect',
        css: {
            'background-color': 'SteelBlue',
            'color': 'SteelBlue',
        }
    }
]


