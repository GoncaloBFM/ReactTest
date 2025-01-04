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
    IconButton, ListItem, ListItemButton, ListItemIcon, Menu, MenuItem, Select, Stack, Tooltip, Typography,
} from "@mui/material";
import {GraphManager} from "@/hooks/useGraphDataManager";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import Image from 'next/image'
import styles from './DetailTab.module.scss'
import personIcon from '../../../public/person.svg'
import CachedIcon from '@mui/icons-material/Cached';
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
import RouteIcon from '@mui/icons-material/Route';
import {AttachMoney, CallSplit} from "@mui/icons-material";
import {TABLE_COLUMNS} from "@/app/defaultTableColumns";
import {Span} from "next/dist/server/lib/trace/tracer";
import {LoadDataPopup} from "@/components/LoadDataPopup/LoadDataPopup";

type Props = {
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    graphManager: GraphManager
    graphData: GraphData
    showBasicAnalysis: boolean
    setShowBasicAnalysis: Dispatch<SetStateAction<boolean>>
    showFlowAnalysis: boolean
    setShowFlowAnalysis: Dispatch<SetStateAction<boolean>>
};

export function DetailTab(props: Props) {
    const [isLoadDataPopupOpen, setLoadDataPopupOpen] = useState(false);
    const [openDeleteGraphPopup, setOpenDeleteGraphPopup] = useState(false);
    const [openNoDataPopup, setOpenNoDataPopup] = useState(false);
    const [openShowDataPopup, setOpenShowDataPopup] = useState(false);
    const [openPatternAnalysisPopup, setOpenPatternAnalysisPopup] = useState(false);
    const [numberNodesInPath, setNumberNodesInPath] = useState(4);
    const subSelectedElements = props.selectedDataManager.subSelectedElements;
    const selectedElements = props.selectedDataManager.selectedElements;
    const setSelectedElements = props.selectedDataManager.setSelectedElements;

    const data = useMemo(() => selectedElements.length == 0 && subSelectedElements.length == 0
            ? []
            : subSelectedElements.length == 0 ? selectedElements : subSelectedElements,
        [selectedElements, subSelectedElements])

    return (
        <Stack className={styles.DetailTab} direction="column">
            <Tooltip title="Load neighbors from database" placement="right">
                <span>
                    <IconButton disabled={data.length == 0 || data[0].elementType == ElementType.edge} onClick={() => {
                        setLoadDataPopupOpen(true)
                    }}>
                        <AllOutIcon/>
                    </IconButton>
                </span>
            </Tooltip>
            {/*<Tooltip title="Pattern analysis" placement="right">*/}
            {/*    <span>*/}
            {/*    <IconButton disabled={data.length == 0 || data[0].elementType == ElementType.edge} onClick={() => {*/}
            {/*        setOpenPatternAnalysisPopup(true)*/}
            {/*    }}>*/}
            {/*        <RouteIcon/>*/}
            {/*    </IconButton>*/}
            {/*    </span>*/}
            {/*</Tooltip>*/}
            <Divider/>
            <Tooltip title="Show data" placement="right">
                <span>
                <IconButton
                    disabled={data.length != 1}
                    onClick={() => {
                        setOpenShowDataPopup(true)
                    }}
                >
                    <ZoomInIcon/>
                </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Show statistics" placement="right">
                <span>
                <IconButton
                    color={props.showBasicAnalysis ? 'primary' : 'default'}
                    onClick={() => {
                        props.setShowFlowAnalysis(false)
                        props.setShowBasicAnalysis(!props.showBasicAnalysis);
                    }}
                >
                    <BarChartIcon/>
                </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Flow analysis" placement="right">
                <span>
                <IconButton
                            color={props.showFlowAnalysis ? 'primary' : 'default'}
                            onClick={() => {
                                props.setShowBasicAnalysis(false)
                                props.setShowFlowAnalysis(!props.showFlowAnalysis)
                            }
                }>
                    <CallSplit/>
                </IconButton>
                </span>
            </Tooltip>
            <Divider/>
            <Tooltip title="Select neighbor elements" placement="right">
                <span>
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
                </span>
            </Tooltip>
            <Tooltip title="Select all transactions" placement="right">
                <span>
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
                </span>
            </Tooltip>
            <Tooltip title="Select outbound transactions" placement="right">
                <span>
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
                </span>
            </Tooltip>
            <Tooltip title="Select inbound transactions" placement="right">
                <span>
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
                </span>
            </Tooltip>
            <Divider/>
            <Tooltip title="Rerun graph layout" placement="right">
                <span>
                <IconButton onClick={() => {props.cytoscapeManager.rerunLayout()}}>
                    <CachedIcon/>
                </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Center on graph" placement="right">
                <span>
                <IconButton onClick={() => {
                    props.cytoscapeManager.cy?.fit()
                }}>
                    <CenterFocusStrongIcon/>
                </IconButton>
                </span>
            </Tooltip>
            <Divider/>
            <Tooltip title='Delete element' placement="right">
                <span>
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
                </span>
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
                open={openShowDataPopup}
                onClose={() => setOpenShowDataPopup(false)}
            >
                <DialogTitle>
                    Element details
                </DialogTitle>
                <DialogContent className={styles.showDataPopup}>
                    {data.length == 1 &&
                        <List dense={false}>
                            {
                                TABLE_COLUMNS[data[0].type].map(info =>
                                    <ListItem key={info.id}><ListItemText secondary={info.header} primary={(data[0] as Record<string, any>)[(info.accessorKey == 'timestamp' ? 'timestampRepresentation' : info.accessorKey)]}></ListItemText></ListItem>
                                )
                            }
                        </List>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenShowDataPopup(false)} autoFocus>
                        Close
                    </Button>
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
            <Dialog
                open={openPatternAnalysisPopup}
                onClose={() => setOpenPatternAnalysisPopup(false)}
            >
                <DialogTitle>
                    Path length
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                    <Typography>Select the maximum length of the paths to load from the database</Typography>
                      <Select
                          size={'small'}
                          value={numberNodesInPath}
                          onChange={(event) => {setNumberNodesInPath(event.target.value as number)}}
                      >
                          <MenuItem value={1}>One node</MenuItem>
                          <MenuItem value={2}>Two nodes</MenuItem>
                          <MenuItem value={3}>Three nodes</MenuItem>
                          <MenuItem value={4}>Four nodes</MenuItem>
                      </Select>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        props.graphManager.loadPathData(data[0].id, data[1].id, numberNodesInPath)
                        setOpenPatternAnalysisPopup(false)
                    }}>
                        Confirm
                    </Button>
                    <Button onClick={() => setOpenPatternAnalysisPopup(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {isLoadDataPopupOpen &&
                <LoadDataPopup
                    loadEdges={false}
                    graphManager={props.graphManager}
                    selectedDataManager={props.selectedDataManager}
                    isOpen={isLoadDataPopupOpen}
                    setOpen={setLoadDataPopupOpen}>
                </LoadDataPopup>
            }

        </Stack>
    );
}
