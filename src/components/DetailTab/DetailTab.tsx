import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton, ListItemButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip,
} from "@mui/material";
import {GraphManager} from "@/hooks/useGraphDataManager";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import Image from 'next/image'
import styles from './DetailTab.module.scss'
import personIcon from '../../../public/person.svg'
import accountIcon from '../../../public/account.svg'
import networkIcon from '../../../public/network.svg'
import {GraphElement} from "@/types/GraphElement";
import {GraphData} from "@/types/GraphData";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import ClearIcon from "@mui/icons-material/Clear";
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddchartIcon from '@mui/icons-material/Addchart';
import BarChartIcon from '@mui/icons-material/BarChart';
import {ElementType} from "@/types/ElementType";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AllOutIcon from '@mui/icons-material/AllOut';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import {GraphEdge} from "@/types/GraphEdge";
import {GraphNode} from "@/types/GraphNode";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {mean, quantile, std, sum} from "@/utils/math";
import {datetimeToString, millisecondsToDHM} from "@/utils/time";
import {sortAscend, sortDescend} from "@/utils/array";
import {CytoscapeManager} from "@/hooks/useCytoscapeManager";
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import {AttachMoney, CallSplit} from "@mui/icons-material";

type Props = {
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    graphManager: GraphManager
    graphData: GraphData
};

export function DetailTab(props: Props) {

    const [openDeleteGraphPopup, setOpenDeleteGraphPopup] = useState(false);
    const [openNoDataPopup, setOpenNoDataPopup] = useState(false);
    const subSelectedElements = props.selectedDataManager.subSelectedElements;
    const selectedElements = props.selectedDataManager.selectedElements;
    const setSelectedElements = props.selectedDataManager.setSelectedElements;

    const data = useMemo(() => selectedElements.length == 0 && subSelectedElements.length == 0
            ? []
            : subSelectedElements.length == 0 ? selectedElements : subSelectedElements,
        [selectedElements, subSelectedElements])

    return (
        <Stack className={styles.DetailTab} direction="column">
            <Tooltip title="Load neighbors from database">
                <IconButton disabled={data.length == 0 || data[0].elementType == ElementType.edge} onClick={() => {
                    props.graphManager.expandNodeData(data.map(e => e.id))
                }}>
                    <AllOutIcon/>
                </IconButton>
            </Tooltip>
            <Divider/>
            <Tooltip title="Show data">
                <IconButton
                    // disabled={data.length != 1}
                    disabled
                    onClick={() => {}}
                >
                    <ZoomInIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Show statistics">
                <IconButton
                    // disabled={props.graphData.edgesList.length == 0 || (data.length == 1 && data[0].elementType == ElementType.edge)}
                    disabled
                    onClick={() => {}}
                >
                    <BarChartIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Flow analysis">
                <IconButton disabled onClick={() => {}}>
                    <CallSplit/>
                </IconButton>
            </Tooltip>
            <Divider/>
            <Tooltip title="Select neighbors">
                <IconButton  disabled={data.length == 0} onClick={() => {
                    if (data[0].elementType == ElementType.node) {
                        const nodeIds = data.map(e => e.id)
                        const result = props.graphData.edgesList.filter(e => nodeIds.includes(e.source) || nodeIds.includes(e.target))
                        if (result.length == 0) {
                            setOpenNoDataPopup(true)
                            return
                        }
                        setSelectedElements(result)
                        //TODO: ^ this is slow, improve performance
                    } else {
                        const edges = data as GraphEdge[]
                        const neighbors = edges.reduce((prev:GraphNode[], edge: GraphEdge) =>
                                prev.concat([props.graphData.nodesMap.get(edge.source), props.graphData.nodesMap.get(edge.target)])
                            , [])
                        if (neighbors.length == 0) {
                            setOpenNoDataPopup(true)
                            return
                        }
                        setSelectedElements(neighbors)
                    }
                }}>
                    <TrackChangesIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Select all transactions">
                <IconButton disabled={data.length == 0 || data[0].elementType == ElementType.edge} onClick={() => {
                    const nodeIds = data.map(e => e.id)
                    const result = props.graphData.edgesList.filter(e => e.type == EdgeType.transaction && (nodeIds.includes(e.source) || nodeIds.includes(e.target)))
                    if (result.length == 0) {
                        setOpenNoDataPopup(true)
                        return
                    }
                    setSelectedElements(result)
                    //TODO: ^ this is slow, improve performance
                }}>
                    <AttachMoney/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Select outbound transactions">
                <IconButton disabled={data.length == 0 || data[0].elementType == ElementType.edge} onClick={() => {
                    const nodeIds = data.map(e => e.id)
                    const result = props.graphData.edgesList.filter(e => e.type == EdgeType.transaction && nodeIds.includes(e.source))
                    if (result.length == 0) {
                        setOpenNoDataPopup(true)
                        return
                    }
                    setSelectedElements(result)
                    //TODO: ^ this is slow, improve performance
                }}>
                    <CallMadeIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Select inbound transactions">
                <IconButton disabled={data.length == 0 || data[0].elementType == ElementType.edge} onClick={() => {
                    const nodeIds = data.map(e => e.id)
                    const result = props.graphData.edgesList.filter(e => e.type == EdgeType.transaction && nodeIds.includes(e.target))
                    if (result.length == 0) {
                        setOpenNoDataPopup(true)
                        return
                    }
                    setSelectedElements(result)
                    //TODO: ^ this is slow, improve performance
                }}>
                    <CallReceivedIcon/>
                </IconButton>
            </Tooltip>
            <Divider/>
            <Tooltip title="Rerun graph layout">
                <IconButton onClick={() => {props.cytoscapeManager.rerunLayout()}}>
                    <RestartAltIcon/>
                </IconButton>
            </Tooltip>
            <Tooltip title="Center on graph">
                <IconButton onClick={() => {props.cytoscapeManager.cy?.fit()}}>
                    <CenterFocusStrongIcon/>
                </IconButton>
            </Tooltip>
            <Divider/>
            <Tooltip title='Delete element'>
                <IconButton onClick={() => {
                    if (data.length == 0) {
                        setOpenDeleteGraphPopup(true)
                    } else if (data[0].elementType == ElementType.node) {
                        props.graphManager.removeNodeData(data.map(e => e.id))
                    } else {
                        props.graphManager.removeEdgeData(data.map(e => e.id))
                    }
                }}>
                    <DeleteOutlineIcon/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={openDeleteGraphPopup}
                onClose={() => setOpenDeleteGraphPopup(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete graph
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        The entire graph will be deleted, are you sure you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={
                        () => {
                            props.graphManager.removeEdgeData(props.graphData.edgesList.map(e => e.id))
                            props.graphManager.removeNodeData(props.graphData.nodesList.map(e => e.id))
                            setOpenDeleteGraphPopup(false)
                        }
                    }>Confirm</Button>
                    <Button onClick={() => setOpenDeleteGraphPopup(false)} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openNoDataPopup}
                onClose={() => setOpenNoDataPopup(false)}
            >
                <DialogTitle>
                    No data found
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenNoDataPopup(false)} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
