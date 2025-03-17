import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    ListItem,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import {GraphManager} from "@/hooks/useGraphDataManager";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import LoupeOutlinedIcon from '@mui/icons-material/LoupeOutlined';
import styles from './ToolsTab.module.scss'
import CachedIcon from '@mui/icons-material/Cached';
import {GraphData} from "@/types/GraphData";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Divider from '@mui/material/Divider';
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
import {CytoscapeManager} from "@/hooks/useCytoscapeManager";
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import RouteIcon from '@mui/icons-material/Route';
import {AttachMoney, CallSplit} from "@mui/icons-material";
import JoinFullIcon from '@mui/icons-material/JoinFull';
import {TABLE_COLUMNS} from "@/app/defaultTableColumns";
import {LoadDataPopup} from "@/components/LoadDataPopup/LoadDataPopup";
import {AnalysisTab} from "@/types/AnalysisTab";

type Props = {
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    graphManager: GraphManager
    graphData: GraphData
    setShowAnalysisTab: Dispatch<SetStateAction<AnalysisTab>>
    showAnalysisTab:AnalysisTab
};

export function ToolsTab(props: Props) {
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
        <Stack className={styles.ToolsTab} direction="column">
            <Tooltip title="Load neighbors from database" placement="right">
                <span>
                    <IconButton disabled={data.length == 0 || data[0].elementType == ElementType.edge} onClick={() => {
                        setLoadDataPopupOpen(true)
                    }}>
                        <AllOutIcon/>
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Show data" placement="right">
                <span>
                <IconButton
                    disabled={data.length != 1}
                    onClick={() => {

                    }}
                >
                    <JoinFullIcon/>
                </IconButton>
                </span>
            </Tooltip>
            {/*<Tooltip title="Show data" placement="right">*/}
            {/*    <span>*/}
            {/*    <IconButton*/}
            {/*        disabled={data.length != 1}*/}
            {/*        onClick={() => {*/}
            {/*            setOpenShowDataPopup(true)*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <LoupeOutlinedIcon/>*/}
            {/*    </IconButton>*/}
            {/*    </span>*/}
            {/*</Tooltip>*/}
            <Divider/>
            <Tooltip title="Pattern analysis" placement="right">
                <span>
                <IconButton
                    color={props.showAnalysisTab == AnalysisTab.PatternAnalysis ? 'primary' : 'default'}
                    onClick={() => {
                        props.setShowAnalysisTab(props.showAnalysisTab == AnalysisTab.PatternAnalysis ? AnalysisTab.None : AnalysisTab.PatternAnalysis);
                    }}>
                    <RouteIcon/>
                </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Flow analysis" placement="right">
                <span>
                <IconButton
                    color={props.showAnalysisTab == AnalysisTab.FlowAnalysis ? 'primary' : 'default'}
                    onClick={() => {
                        props.setShowAnalysisTab(props.showAnalysisTab == AnalysisTab.FlowAnalysis ? AnalysisTab.None : AnalysisTab.FlowAnalysis);
                    }}>
                    <CallSplit/>
                </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Show statistics" placement="right">
                <span>
                <IconButton
                    color={props.showAnalysisTab == AnalysisTab.Statistics ? 'primary' : 'default'}
                    onClick={() => {
                        props.setShowAnalysisTab(props.showAnalysisTab == AnalysisTab.Statistics ? AnalysisTab.None : AnalysisTab.Statistics);
                    }}
                >
                    <BarChartIcon/>
                </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Show timeline" placement="right">
                <span>
                <IconButton
                    color={props.showAnalysisTab == AnalysisTab.Sankey ? 'primary' : 'default'}
                    onClick={() => {
                        props.setShowAnalysisTab(props.showAnalysisTab == AnalysisTab.Sankey ? AnalysisTab.None : AnalysisTab.Sankey);
                    }}
                >
                    <AccessTimeIcon/>
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
                    originNodeIds={data.map(e => e.id)}
                    graphManager={props.graphManager}
                    selectedDataManager={props.selectedDataManager}
                    isOpen={isLoadDataPopupOpen}
                    setOpen={setLoadDataPopupOpen}>
                </LoadDataPopup>
            }

        </Stack>
    );
}
