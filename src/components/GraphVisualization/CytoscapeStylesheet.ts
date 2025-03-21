const SELECTED_COLOR = '#D1495B'
const HIGHLIGHTED_COLOR = '#D1495B'

export const CYTOSCAPE_STYLESHEET = [
    {
        selector: 'core',
        style: {
            'selection-box-opacity': 0.0,
            'active-bg-opacity': 0,
        }
    }, {
        selector: 'node',
        classes: [],
        style: {
            'outline-opacity': 1,
            'overlay-opacity': 0,
            'font-size': 5,
            shape: 'ellipse',
            width: 10,
            height: 10,
            'text-background-color': '#eee',
            'text-background-shape': 'round-rectangle',
            'text-background-opacity': 1,
            'background-image-containment': 'over',
            'background-width': '70%',
            'background-height': '70%',
            'z-index': 1,
        }
    }, {
        selector: 'edge',
        classes: [],
        style: {
            'overlay-opacity': 0,
            'width': 0.5,
            'font-size': 4,
            'curve-style': 'bezier',
            'edge-text-rotation': 'autorotate',
            "text-margin-x": "0px",
            "text-margin-y": "0px",
            'text-background-opacity': 1,
            'text-background-color': '#eee  ',
            'text-background-shape': 'round-rectangle',
            'z-index': 1,
        }
    }, {
        selector: 'node[type="compound"]',
        style: {
            'background-color': '#f3f3f3',
            label: 'data(id)',
            'border-color': '#777777',
            'text-background-opacity': 0,
        }
    },  {
        selector: 'node[type="person"]',
        style: {
            'background-color': '#0096c7',
            label: 'data(name)',
            'background-image': '/person.svg',
        }
    // }, {
    //     selector: 'node[expanded="false"]',
    //     style: {
    //         'border-position':'inside',
    //         'border-color':'black',
    //         'border-opacity': 1,
    //         'border-style': 'dotted',
    //         'border-width': 0.6,
    //     }
    }, {
        selector: 'node[type="account"]',
        style: {
            'background-image': '/account.svg',
            'background-color': '#EDAE49',
            label: 'data(id)',
        }
    } , {
        selector: 'node[type="company"]',
        style: {
            'background-image': '/company.svg',
            'background-color': '#a6d720',
            label: 'data(name)',
        }
    },{
        selector: 'edge[type="transaction"]',
        style: {
            label: 'data(label)',
            'target-arrow-shape': 'triangle',
            'line-color': '#000',
            'target-arrow-color': '#000',
            'source-arrow-color': '#000',
            'arrow-scale': 0.3,
        }
    }, {
        selector: 'edge[type="connection"]',
        style: {
            'line-color': '#000',
            'line-style': 'dashed',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#000',
            'source-arrow-color': '#000',
            'arrow-scale': 0.3,
        }
    }, {
        selector: 'edge[type="connection"]',
        style: {
            'line-color': '#000',
            'line-style': 'dashed',
            'target-arrow-shape': 'triangle',
            label: 'data(name)'
        }
    }, {
        selector: '.manualEdgeSelect',
        css: {
            'line-color': SELECTED_COLOR,
            'width': 1,
            'arrow-scale': 0.4,
            'color': SELECTED_COLOR,
            'target-arrow-color': SELECTED_COLOR,
            'source-arrow-color': SELECTED_COLOR,
            'z-index': 2,
        }
    }, {
        selector: '.manualEdgeHighlight',
        css: {
            'underlay-shape': 'ellipse',
            'underlay-padding': 4,
            'underlay-opacity': .2,
            'underlay-color': HIGHLIGHTED_COLOR
        }
    },{
        selector: '.showFlow',
        style: {
            'background-image': null,
            'pie-size': '80%',
            'pie-1-background-color': '#4ed720',
            'pie-1-background-size': 'data(pieIn)',
            'pie-1-background-opacity': 'data(opacity)',
            'pie-2-background-color': '#d72020',
            'pie-2-background-size': 'data(pieOut)',
            'pie-2-background-opacity': 'data(opacity)',
            'pie-3-background-color': '#989898',
            'pie-3-background-size': 'data(noPie)',
            'pie-3-background-opacity': 'data(opacity)',
            'background-opacity': 'data(opacity)',
            'border-opacity': 'data(opacity)',
            'background-image-opacity': 'data(opacity)',
            'line-opacity': 'data(opacity)',
        }
    }, {
    selector: '.dimmedElement',
        style: {
            'z-index': 0,
            'text-opacity': 0,
            'background-opacity': 0,
            'border-opacity': 0.1,
            'background-image-opacity': 0.1,
            'line-opacity': 0.1,
            'pie-1-background-opacity': 0.1,
            'pie-2-background-opacity': 0.1,
            'pie-3-background-opacity': 0.1,
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
        selector: '.manualNodeSelect[type!="compound"]',
        css: {
            'background-color': SELECTED_COLOR,
            'color': SELECTED_COLOR,
            'z-index': 2,
        }
    }, {
        selector: '.manualNodeSelect[type="compound"]',
        css: {
            'border-color': SELECTED_COLOR,
            'z-index': 2,
        }
    }, {
        selector: '.hideLabels',//TODO: Add setting for hiding labels
        css: {
            'label':''
        }
    }
]


