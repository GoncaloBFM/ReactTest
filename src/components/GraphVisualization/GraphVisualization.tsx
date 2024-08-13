import React, {MutableRefObject, Ref, SetStateAction, useEffect, useMemo, useRef, useState} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import styles from './GraphVisualization.module.scss';
import {SERVER_URL} from "@/app/definitions";
import {node} from "prop-types";
import cytoscape, {Core} from 'cytoscape';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import cxtmenu from 'cytoscape-cxtmenu';
import {CytoscapeManagerType} from "@/types/CytoscapeManagerType";
import {NodeDataType} from "@/types/NodeDataType";
import {GraphData} from "@/types/GraphData";
import {EdgeDataType} from "@/types/EdgeDataType";

cytoscape.use(COSEBilkent);

type Props = {
    graphData: GraphData,
    setSelectedElement: SetStateAction<any>,
    selectedElement: NodeDataType | undefined,
    manager: CytoscapeManagerType
};

export function GraphVisualization(props: Props) {

    const ref = props.manager.ref

    useEffect(() =>
        {ref.current?.layout(props.manager.layout).run();},
        [props.graphData, props.manager.layout, ref]
    );

    useEffect( () => {
        ref.current?.on('tap', (e:any) => {
            if (e.target === ref.current) {
                props.setSelectedElement(undefined);
            }
        })

        ref.current?.on('click', 'node', (e:any)=> {props.setSelectedElement(e.target.data())})
    })


    useEffect(() => {
        if (props.selectedElement) {
            ref.current?.elements().deselect();
            ref.current?.elements(`node[id="${props.selectedElement.id}"]`).select();
        } else {
            ref.current?.elements().deselect();
        }
    }, [props.selectedElement]);


    const createCytoscapeGraph = useMemo(() => {
        return (graphData: GraphData) => {
            const cytoscapeNodes = graphData.nodes.map(createCytoscapeNode);
            const cytoscapeEdges = graphData.edges.map(createCytoscapeEdge)
            return [...cytoscapeNodes, ...cytoscapeEdges]
        }
    }, []);


    const createCytoscapeNode = (nodeData: NodeDataType) => {
        return {data: nodeData}
    }

    const createCytoscapeEdge = (edgeData: EdgeDataType) => {
        return {data: edgeData}
    }

    const stylesheet:any = [
        {
            selector: 'core',
            style: {
                'selection-box-opacity':0,
                'active-bg-opacity':0,
            }
        }, {
            selector: 'node',
            style: {
                'overlay-opacity':0,
                shape:'ellipse',
                width:10,
                height:10,
            }
        }, {
            selector: 'edge',
            style: {
                'overlay-opacity':0,
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
    
    return <CytoscapeComponent
        elements={createCytoscapeGraph(props.graphData)}
        layout={props.manager.layout}
        className={styles.GraphVisualization}
        cy={(cy) => {ref.current = cy;}}
        zoom={2}
        stylesheet={stylesheet}
    />;

}
