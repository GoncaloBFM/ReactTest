import * as d3 from "d3";
import {linkHorizontal} from "d3-shape";
import React, {Dispatch, ReactElement, ReactNode, SetStateAction, useMemo, useState} from "react";
import styles from "@/components/Sankey/Sankey.module.scss";
import {Box, Grid2, Stack, Tooltip, Typography} from "@mui/material";
import {GraphData} from "@/types/GraphData";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {ElementType} from "@/types/ElementType";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {Overpass_Mono} from "next/dist/compiled/@next/font/dist/google";
import {MouseTracker} from "@/components/MouseTracker/MouseTracker";
import {AnalysisTab} from "@/types/AnalysisTab";
import {CytoscapeManager} from "@/hooks/useCytoscapeManager";

type NodeData = {
    order: number;
};

const COLORS = d3.schemeDark2;

// export const data = {
//     nodes: {
//         'bob': {order:0},
//         'alice': {order:1},
//         'carol': {order:2},
//         'mel': {order:3},
//         'yan': {order:4},
//     } as {[key: string]: NodeData},
//     linkCols: [
//         [
//             { source: "bob", target: "carol", value: 2 },
//             { source: "alice", target: "carol", value: 2 },
//             { source: "alice", target: "yan", value: 2 },
//             { source: "carol", target: "mel", value: 2 },
//             { source: "carol", target: "yan", value: 2 },
//         ],
//         [
//             { source: "bob", target: "carol", value: 2 },
//             { source: "alice", target: "carol", value: 2 },
//             { source: "alice", target: "yan", value: 2 },
//             { source: "carol", target: "mel", value: 2 },
//             { source: "carol", target: "yan", value: 2 },
//         ],
//         [
//
//         ],
//         [
//
//         ],
//         [
//             { source: "bob", target: "carol", value: 2 },
//             { source: "alice", target: "carol", value: 2 },
//             { source: "alice", target: "yan", value: 2 },
//             { source: "carol", target: "mel", value: 2 },
//             { source: "carol", target: "yan", value: 2 },
//         ],
//         [
//             { source: "bob", target: "carol", value: 2 },
//             { source: "alice", target: "carol", value: 2 },
//             { source: "alice", target: "yan", value: 2 },
//             { source: "carol", target: "mel", value: 2 },
//             { source: "carol", target: "yan", value: 2 },
//         ],
//         [
//             { source: "bob", target: "carol", value: 2 },
//             { source: "alice", target: "carol", value: 2 },
//             { source: "alice", target: "yan", value: 2 },
//             { source: "carol", target: "mel", value: 2 },
//             { source: "carol", target: "yan", value: 2 },
//         ],
//         [
//             { source: "bob", target: "carol", value: 2 },
//             { source: "alice", target: "carol", value: 2 },
//             { source: "alice", target: "yan", value: 2 },
//             { source: "carol", target: "mel", value: 2 },
//             { source: "carol", target: "yan", value: 2 },
//         ],
//         [
//             { source: "bob", target: "carol", value: 2 },
//             { source: "alice", target: "carol", value: 2 },
//             { source: "alice", target: "yan", value: 2 },
//             { source: "carol", target: "mel", value: 2 },
//             { source: "carol", target: "yan", value: 2 },
//         ]
//     ]
// }

const PADDING_TOP = 0
const PADDING_BOTTOM = 30
const NODE_LABELS_WIDTH = 70
const NODE_WIDTH= 5
const NODE_HEIGHT = 15
const NODE_VERTICAL_SPACING = 20
const NODE_HORIZONTAL_SPACING = 130
const NODE_EMPTY_HORIZONTAL_SPACING = 30
const LINK_THICKNESS = NODE_HEIGHT
const FONT_SIZE = 15
const FONT_FAMILY = 'monospace'
const FONT_CHAR_WIDTH = 7.201171875
const FONT_CHAR_HEIGHT = 14.40234375

export type SankeyLink = {source: string, target:string, amount:number, count: number}
export type SankeyLinkCol = {label: string, links: SankeyLink[]}
export type SankeyLinkNodes = {[key: string]: {order: number}}

//https://jsfiddle.net/eNzjZ/34/
type Props = {
    nodes: SankeyLinkNodes,
    linkCols: SankeyLinkCol[]
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    graphData: GraphData
    setShowAnalysisTab: Dispatch<SetStateAction<AnalysisTab>>
}

export function Sankey({nodes, linkCols, selectedDataManager, cytoscapeManager, graphData, setShowAnalysisTab}: Props) {
    const [tooltip, setTooltip] = useState<ReactNode | null>(null)

    const [nodeLabels, linkVisualization, visWidth, visHeight] = useMemo(() => {
        const colorMap = Object.fromEntries(Object.keys(nodes).map((n, i) => [n, COLORS[i]]))
        let prevColSpace = 0
        const linkColLabel = new Array<ReactElement>()
        const allLinks = new Array<ReactElement>()
        const allNodes = new Array<ReactElement>()
        const nodeCount = Object.values(nodes).length

        linkCols.forEach((linkCol, col) => {
            if (linkCol.links.length == 0 && linkCols[col - 1].links.length == 0) {
                return
            }
            linkCol.links.forEach(link => {
                const source = nodes[link.source]
                const sourceOrder = source.order
                const targetOrder = nodes[link.target].order
                const sourceX = prevColSpace + NODE_WIDTH
                const sourceY = PADDING_TOP + NODE_HEIGHT * sourceOrder + sourceOrder * NODE_VERTICAL_SPACING + LINK_THICKNESS / 2
                const targetX = prevColSpace + NODE_HORIZONTAL_SPACING + NODE_WIDTH
                const targetY = PADDING_TOP + NODE_HEIGHT * targetOrder + targetOrder * NODE_VERTICAL_SPACING + LINK_THICKNESS / 2
                const path = linkHorizontal().source(f => [sourceX, sourceY]).target(f => [targetX, targetY])({} as any) as string
                const id = link.source + link.target + col.toString()
                allLinks.push(
                    <path
                        id={id}
                        key={id}
                        d={path}
                        stroke={colorMap[link.source]}
                        fill="none"
                        strokeOpacity={0.2}
                        strokeWidth={LINK_THICKNESS}
                        onMouseEnter={e => {
                            d3.select(`#${id}`).attr('stroke-opacity', 0.5)
                            setTooltip(<Stack><div className={styles.TooltipText}>Count: {link.count}</div><div className={styles.TooltipText}>Total: {link.amount.toFixed(2)} USD</div></Stack>)
                        }}
                        onMouseLeave={e => {
                            d3.select(`#${id}`).attr('stroke-opacity', 0.2)
                            setTooltip(null)
                        }}
                        onClick={e => {
                            console.log(id)
                        }}
                    />
                )
            })

            if (linkCol.links.length > 0) {
                linkColLabel.push(
                    <text
                        key={col}
                        x={prevColSpace + NODE_HORIZONTAL_SPACING / 2 - (FONT_CHAR_WIDTH * '10/Sep/2003'.length) / 2}
                        y={PADDING_TOP + NODE_HEIGHT * nodeCount + nodeCount * NODE_VERTICAL_SPACING}
                        fontFamily={FONT_FAMILY}
                        fontSize={FONT_SIZE}
                        className={styles.linkColLabel}
                        onClick={e => {
                            console.log(col)
                        }}
                    >{linkCol.label}</text>
                )
            }

            Object.entries(nodes).forEach(([nodeId, nodeData]) => {
                allNodes.push(
                    <rect
                        key={nodeId + col.toString()}
                        height={NODE_HEIGHT}
                        width={NODE_WIDTH}
                        x={prevColSpace}
                        y={PADDING_TOP + NODE_HEIGHT * nodeData.order + nodeData.order * NODE_VERTICAL_SPACING}
                        fill={colorMap[nodeId]}
                        rx={0.9}
                    />
                )
            });

            prevColSpace += linkCol.links.length > 0 ? NODE_HORIZONTAL_SPACING + NODE_WIDTH : NODE_EMPTY_HORIZONTAL_SPACING + NODE_WIDTH
        });

        Object.entries(nodes).forEach(([nodeId, nodeData]) => {
            allNodes.push(
                <rect
                    key={nodeId + linkCols.length.toString()}
                    height={NODE_HEIGHT}
                    width={NODE_WIDTH}
                    x={prevColSpace}
                    y={PADDING_TOP + NODE_HEIGHT * nodeData.order + nodeData.order * NODE_VERTICAL_SPACING}
                    fill={colorMap[nodeId]}
                    rx={0.9}
                />
            )
        });
        prevColSpace += NODE_WIDTH


        const nodeLabels = new Array<ReactElement>()
        Object.entries(nodes).forEach(([nodeId, {order}]) => {
            nodeLabels.push(
                <text
                    key={nodeId}
                    x={0}
                    onMouseEnter={()=> {cytoscapeManager.addElementHighlight(nodeId)}}
                    onMouseLeave={() => {cytoscapeManager.removeElementHighlight(nodeId)}}
                    onClick={()=>{
                        cytoscapeManager.removeElementHighlight(nodeId)
                        selectedDataManager.setSelectedElements([graphData.nodesMap.get(nodeId)])
                        setShowAnalysisTab(AnalysisTab.Statistics)
                    }}
                    fontSize={FONT_SIZE}
                    fontFamily={FONT_FAMILY}
                    y={PADDING_TOP + NODE_HEIGHT * order + order * NODE_VERTICAL_SPACING + NODE_HEIGHT / 2 + FONT_CHAR_HEIGHT / 2 - 2}
                    className={styles.nodeLabel}
                >{nodeId}
                </text>
            )
        });

        const dashedLines = new Array<ReactElement>()
        Object.entries(nodes).forEach(([nodeId, {order}]) => {
            const x1 = NODE_WIDTH
            const y = PADDING_TOP + NODE_HEIGHT * order + order * NODE_VERTICAL_SPACING + NODE_HEIGHT / 2
            dashedLines.push(
                <line
                    key={nodeId}
                    x1={x1}
                    y1={y}
                    x2={prevColSpace}
                    y2={y}
                    stroke={'#999'}
                    strokeWidth={0.5}
                    strokeDasharray={10}
                />
            )
        });

        const visHeight = (NODE_VERTICAL_SPACING + NODE_HEIGHT) * Object.values(nodes).length + PADDING_TOP + PADDING_BOTTOM
        const linkVisualization = allNodes.concat(allLinks).concat(dashedLines).concat(linkColLabel)
        return [nodeLabels, linkVisualization, prevColSpace, visHeight]
    }, [cytoscapeManager, selectedDataManager, linkCols, nodes]);


    return (
        <>
            {tooltip && <MouseTracker>{tooltip}</MouseTracker>}
            <Grid2 container className={styles.Sankey}>
                <Grid2 size={'auto'}>
                    <svg width={NODE_LABELS_WIDTH + 1} height={visHeight}>
                        {nodeLabels}
                        <line
                            x1={NODE_LABELS_WIDTH + 1}
                            y1={0}
                            x2={NODE_LABELS_WIDTH + 1}
                            y2={visHeight - NODE_VERTICAL_SPACING - PADDING_BOTTOM}
                            stroke={'#999'}
                            strokeWidth={1}
                        />
                    </svg>
                </Grid2>
                <Grid2 className={styles.linkVisualization} size={'grow'}>
                    <svg width={visWidth} height={visHeight}>
                        {linkVisualization}
                    </svg>
                </Grid2>
                <Grid2>
                    <svg width={1} height={visHeight}>
                        <line
                            x1={0}
                            y1={0}
                            x2={0}
                            y2={visHeight - NODE_VERTICAL_SPACING - PADDING_BOTTOM}
                            stroke={'#999'}
                            strokeWidth={1}
                        />
                    </svg>
                </Grid2>
            </Grid2>
        </>
    )
}