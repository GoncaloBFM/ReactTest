import React, {SetStateAction, useEffect, useMemo, useState} from 'react';
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
import statsIcon from '../../../public/stats.svg'
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

type Props = {
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    graphManager: GraphManager
    graphData: GraphData
};

export function DetailTab(props: Props) {

    const [openDeleteGraphPopup, setOpenDeleteGraphPopup] = useState(false);
    const [showSummary, setShowSummary] = useState(false)

    const subSelectedElements = props.selectedDataManager.subSelectedElements;
    const selectedElements = props.selectedDataManager.selectedElements;
    const setSelectedElements = props.selectedDataManager.setSelectedElements;

    const [anchorElGraphLayoutControls, setAnchorElGraphLayoutControls] = useState<null | HTMLElement>(null);
    const showGraphLayoutControls = Boolean(anchorElGraphLayoutControls);

    const data = useMemo(() => selectedElements.length == 0 && subSelectedElements.length == 0
            ? []
            : subSelectedElements.length == 0 ? selectedElements : subSelectedElements,
        [selectedElements, subSelectedElements])


    useEffect(()=> {
        setShowSummary(false)
    }, [selectedElements, subSelectedElements, props.graphData])

    const summary = (data: GraphElement[]) => {
        //TODO: Fix NaNs when only one account is selected
        if (data[0].elementType == ElementType.edge) {
            const transactions = data.filter(edge => edge.type == EdgeType.transaction) as TransactionEdge[]
            const transactionAmounts = transactions.map(edge => edge.amountPaid)
            const transactionsMils = sortDescend(transactions.map(edge => edge.timestamp.getTime()))
            const totalTimeElapsed = millisecondsToDHM(transactionsMils[0] - transactionsMils[transactionsMils.length - 1])
            const timeDifferencePairs = new Array<number>()
            for(let i=0; i < transactionsMils.length - 1; i++){
                timeDifferencePairs.push(transactionsMils[i] - transactionsMils[i + 1])
            }
            const avgTimeElapsed = millisecondsToDHM(mean(timeDifferencePairs))

            return <List dense={true}>
                <ListItemButton>
                    <ListItemText primary={'Number of transactions'} secondary={transactionAmounts.length}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Total money transferred'}
                                  secondary={sum(transactionAmounts).toFixed(2) + ' USD'}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Average amount transferred'}
                                  secondary={mean(transactionAmounts).toFixed(2) + ' USD'}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'STD of amount transferred'}
                                  secondary={std(transactionAmounts).toFixed(2) + ' USD'}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Total time between transactions'} secondary={`${totalTimeElapsed.days} days; ${totalTimeElapsed.hours} hour; ${totalTimeElapsed.minutes} min`}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Average time between transactions'} secondary={
                        `${avgTimeElapsed.days} days; ${avgTimeElapsed.hours} hour; ${avgTimeElapsed.minutes} min`
                    }/>
                </ListItemButton>
            </List>
        } else {
            const nodeIds = data.map(node => node.id)
            const inTransactions = new Array<TransactionEdge>()
            const outTransactions = new Array<TransactionEdge>()
            props.graphData.edgesList.forEach(e=> {
                    if (e.type == EdgeType.transaction) {
                        if (nodeIds.includes(e.target))
                            inTransactions.push(e as TransactionEdge)
                        if (nodeIds.includes(e.source))
                            outTransactions.push(e as TransactionEdge)
                    }
                }
            )
            const inTransactionsAmounts = inTransactions.map(e => e.amountPaid)
            const outTransactionsAmounts = outTransactions.map(e => e.amountPaid)
            const totalInTransactionsAmounts = sum(inTransactionsAmounts)
            const totalOutTransactionsAmounts = sum(outTransactionsAmounts)
            const transactionsMils = inTransactions.concat(outTransactions).map(edge => edge.timestamp.getTime())
            const totalTimeElapsed = millisecondsToDHM(Math.max(...transactionsMils) - Math.min(...transactionsMils))

            return <List dense={true}>
                <ListItemButton>
                    <ListItemText primary={'Number of outbound transactions'} secondary={outTransactionsAmounts.length}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Number of inbound transactions'} secondary={inTransactionsAmounts.length}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Total amount outbound transactions'} secondary={totalInTransactionsAmounts.toFixed(2) + ' USD'}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Total amount inbound transactions'} secondary={totalOutTransactionsAmounts.toFixed(2) + ' USD'}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Net transactions (what to call this?)'} secondary={(totalInTransactionsAmounts - totalOutTransactionsAmounts).toFixed(2) + ' USD'}/>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary={'Total time between all transactions'} secondary={`${totalTimeElapsed.days} days; ${totalTimeElapsed.hours} hour; ${totalTimeElapsed.minutes} min`}/>
                </ListItemButton>
            </List>
        }
    }

    return (
        <Card className={styles.DetailTab}>
            <CardHeader className={styles.cardHeader}
                        avatar={
                            <Image src={networkIcon} alt='' className={styles.image}/>
                        }
                        title='Graph constrols'

                        subheader={
                            data.length == 0
                                ? `${props.graphData.nodesMap.size} nodes, ${props.graphData.edgesMap.size} relations`
                                : `${data.length} element${data.length == 1 ? '' : 's'} selected`
                        }
                        action={
                            <IconButton aria-label="settings" onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                setAnchorElGraphLayoutControls(event.currentTarget);
                            }}>
                                <MoreVertIcon />
                            </IconButton>
                        }
            />
            <Menu
                open={showGraphLayoutControls}
                anchorEl={anchorElGraphLayoutControls}
                onClose={() => {setAnchorElGraphLayoutControls(null)}}
            >
                <MenuItem onClick={() => {
                    props.cytoscapeManager.rerunLayout()
                    setAnchorElGraphLayoutControls(null)
                }}>Rerun layout</MenuItem>
                <MenuItem onClick={() => {
                    props.cytoscapeManager.cy?.fit()
                    setAnchorElGraphLayoutControls(null)
                }}>Center on graph</MenuItem>
            </Menu>
            <CardActions>
                <Stack direction={'row'} width={'100%'} justifyContent={data.length > 0 ? "space-between" : 'right'}>
                    {data.length > 0 &&
                        <Stack direction={'row'}>
                            <Tooltip title="Show statistics">
                                <IconButton onClick={() => console.info('Edit')}>
                                    <AddchartIcon/>
                                </IconButton>
                            </Tooltip>
                            {data.length == 1 &&

                                <Tooltip title="Show data">
                                    <IconButton onClick={() => console.info('Edit')}>
                                        <ZoomInIcon/>
                                    </IconButton>
                                </Tooltip>
                            }
                            <Tooltip title="Select neighbors">
                                <IconButton  onClick={() => {
                                    if (data[0].elementType == ElementType.node) {
                                        const nodeIds = data.map(e => e.id)
                                        setSelectedElements(props.graphData.edgesList.filter(e => nodeIds.includes(e.source) || nodeIds.includes(e.target)))
                                        //TODO: ^ this is slow, improve performance
                                    } else {
                                        const edges = data as GraphEdge[]
                                        const neighbors = edges.reduce((prev:GraphNode[], edge: GraphEdge) =>
                                                prev.concat([props.graphData.nodesMap.get(edge.source), props.graphData.nodesMap.get(edge.target)])
                                            , [])
                                        setSelectedElements(neighbors)
                                    }
                                }}>
                                    <TrackChangesIcon/>
                                </IconButton>
                            </Tooltip>
                            {data[0].elementType == ElementType.node && //TODO: only allow for this when possible
                                [

                                    <Tooltip key='1' title="Select outbound transactions">
                                        <IconButton onClick={() => {
                                            const nodeIds = data.map(e => e.id)
                                            setSelectedElements(props.graphData.edgesList.filter(e => e.type == EdgeType.transaction && nodeIds.includes(e.source)))
                                            //TODO: ^ this is slow, improve performance
                                        }}>
                                            <CallMadeIcon/>
                                        </IconButton>
                                    </Tooltip>,
                                    <Tooltip key='2' title="Select inbound transactions">
                                        <IconButton onClick={() => {
                                            const nodeIds = data.map(e => e.id)
                                            setSelectedElements(props.graphData.edgesList.filter(e => e.type == EdgeType.transaction && nodeIds.includes(e.target)))
                                            //TODO: ^ this is slow, improve performance
                                        }}>
                                            <CallReceivedIcon/>
                                        </IconButton>
                                    </Tooltip>,
                                    <Tooltip key='3' title="Expand nodes">
                                        <IconButton onClick={() => {props.graphManager.expandNodeData(data.map(e => e.id))}}>
                                            <AllOutIcon/>
                                        </IconButton>
                                    </Tooltip>
                                ]
                            }
                        </Stack>
                    }
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
                </Stack>
            </CardActions>

            <Divider />

                <CardHeader className={styles.cardHeader}
                            avatar={
                                <Image src={statsIcon} alt='' className={styles.image}/>
                            }
                            title='Transactions summary'
                            subheader={data.length > 0 ? 'of selection' : 'of graph'}
                />
                <CardContent className={styles.summary}>
                    {!showSummary
                        ? <Box className={styles.runContainer}>
                            <Button disabled={props.graphData.edgesList.length == 0 || (data.length == 1 && data[0].elementType == ElementType.edge)} endIcon={<PlayArrowIcon/>} onClick={() => {setShowSummary(true)}}>
                                Run
                            </Button>
                        </Box>
                        : summary(data.length > 0 ? data : props.graphData.edgesList)
                    }
                </CardContent>

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
            </Card>

    );
}
