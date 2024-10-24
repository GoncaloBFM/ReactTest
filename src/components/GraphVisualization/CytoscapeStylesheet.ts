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
            'background-image': '/person.svg',
            'background-image-containment': 'over',
            'background-fit' : 'contain'
        }
    }, {
        selector: 'node[expanded="false"]',
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
            'background-image': '/account.svg',
            'background-image-containment': 'over',
            'background-fit' : 'contain',
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
            'line-color': '#000',
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
        selector: 'node[faded="true"]',
        style: {
            'text-opacity': 0.2,
            'background-opacity': 0.2,
            'border-opacity': 0.2,
            'background-image-opacity': 0.2
        }
    }, {
        selector: 'edge[faded="true"]',
        style: {
            'text-opacity': 0.2,
            'background-opacity': 0.2,
            'line-opacity': 0.2,
        }
    }, {
        selector: '.manualNodeSelect',
        css: {
            'background-color': 'SteelBlue',
            'color': 'SteelBlue',
        }
    }
]


