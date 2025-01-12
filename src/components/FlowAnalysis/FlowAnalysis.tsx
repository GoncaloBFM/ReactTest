import styles from "@/components/FlowAnalysis/FlowAnalysis.module.scss";
import React, {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {Card, CardContent, CardHeader, Collapse, ListItemButton, Stack, Typography} from "@mui/material";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import Image from "next/image";
import statsIcon from "../../../public/flow.svg";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {SafeMap} from "@/utils/SafeMap";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {datetimeToString} from "@/utils/time";
import {bifurcateBy} from "@/utils/array";
import {CytoscapeManager} from "@/hooks/useCytoscapeManager";
import {GraphData} from "@/types/GraphData";
import {GraphEdge} from "@/types/GraphEdge";
import {AnalysisTab} from "@/types/AnalysisTab";

type Props = {
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    graphData: GraphData
    setShowAnalysisTab: Dispatch<SetStateAction<AnalysisTab>>
}

//type BankEntry = {nodeId: string, out:number, in:number, available: number, firstDate: number}

class BankEntry {
    nodeId: string;
    out:number;
    in:number;
    available: number;
    firstDate: number;
    count: number;
    fixedDate: boolean | undefined;
    constructor(nodeId: string) {
        this.nodeId = nodeId
        this.out = 0
        this.in = 0
        this.available = 0
        this.firstDate = MAX_DATE
        this.count = 0
        this.fixedDate = undefined
    }

    receive (value: number, date: number) {
        this.available += value
        this.in += value
        this.firstDate = Math.min(this.firstDate, date)
        this.count += 1
    }

    send (value: number, date: number) {
        this.available -= value
        this.out += value
        this.firstDate = Math.min(this.firstDate, date)
        this.count += 1
    }
}

const MAX_DATE = 8640000000000000

export function FlowAnalysis(props: Props) {
    const [wellsOpen, setWellsOpen] = React.useState(true);
    const [sinksOpen, setSinksOpen] = React.useState(true);
    const [middleOpen, setMiddleOpen] = React.useState(true);

    //TODO: refactor and remove duplicated code on events
    const formatWellEntry = useCallback((e: BankEntry) => <ListItemButton>
            <ListItemText
                onMouseEnter={()=> {props.cytoscapeManager.addElementHighlight(e.nodeId)}}
                onMouseLeave={() => {props.cytoscapeManager.removeElementHighlight(e.nodeId)}}
                onClick={()=>{
                    props.cytoscapeManager.removeElementHighlight(e.nodeId)
                    props.selectedDataManager.setSelectedElements([props.graphData.nodesMap.get(e.nodeId)])
                    props.setShowAnalysisTab(AnalysisTab.Statistics)
                }}
                key={e.nodeId}
                className={styles.entry}
                secondary={`Out: ${e.out.toFixed(2)} USD`}
                primary={`${e.nodeId} (first activity: ${e.firstDate == MAX_DATE ? 'unknown' : datetimeToString(new Date(e.firstDate))})`}>
            </ListItemText>
        </ListItemButton>
        ,[props.cytoscapeManager, props.graphData.nodesMap, props.selectedDataManager])

    const formatMiddleEntry = useCallback((e: BankEntry) => <ListItemButton>
            <ListItemText
                onMouseEnter={()=> {props.cytoscapeManager.addElementHighlight(e.nodeId)}}
                onMouseLeave={() => {props.cytoscapeManager.removeElementHighlight(e.nodeId)}}
                onClick={()=>{
                    props.cytoscapeManager.removeElementHighlight(e.nodeId)
                    props.selectedDataManager.setSelectedElements([props.graphData.nodesMap.get(e.nodeId)])
                    props.setShowAnalysisTab(AnalysisTab.Statistics)
                }}
                key={e.nodeId}
                className={styles.entry}
                secondary={`In: ${e.in.toFixed(2)} USD Out: ${e.out.toFixed(2)} USD Net: ${e.available.toFixed(2)} USD`}
                primary={`${e.nodeId} (first activity: ${e.firstDate == MAX_DATE ? 'unknown' : datetimeToString(new Date(e.firstDate))})`}>
            </ListItemText>
        </ListItemButton>
        ,[props.cytoscapeManager, props.graphData.nodesMap, props.selectedDataManager])

    const formatSinkEntry = useCallback((e: BankEntry) => <ListItemButton>
            <ListItemText
                onMouseEnter={()=> {props.cytoscapeManager.addElementHighlight(e.nodeId)}}
                onMouseLeave={() => {props.cytoscapeManager.removeElementHighlight(e.nodeId)}}
                onClick={()=>{
                    props.cytoscapeManager.removeElementHighlight(e.nodeId)
                    props.selectedDataManager.setSelectedElements([props.graphData.nodesMap.get(e.nodeId)])
                    props.setShowAnalysisTab(AnalysisTab.Statistics)
                }}
                key={e.nodeId}
                className={styles.entry}
                secondary={`In: ${e.in.toFixed(2)} USD`}
                primary={`${e.nodeId} (first activity: ${e.firstDate == MAX_DATE ? 'unknown' : datetimeToString(new Date(e.firstDate))})`}>
            </ListItemText>
        </ListItemButton>
        , [props.cytoscapeManager, props.graphData.nodesMap, props.selectedDataManager])

    const [wellsList, middlesList, sinksList] = useMemo(() => {
        const data = (props.selectedDataManager.subSelectedElements.length == 0 ? props.selectedDataManager.selectedElements : props.selectedDataManager.subSelectedElements) as GraphEdge[]
        const [rawTransactions, nonTransactions] = bifurcateBy(data, edge => edge.type == EdgeType.transaction)
        const freeFlows = new SafeMap<string, string>()
        nonTransactions.forEach(f => {
            freeFlows.set(f.source, f.target)
            freeFlows.set(f.target, f.target)
        })
        const transactions = rawTransactions as TransactionEdge[]
        transactions.sort((transaction1, transaction2) => transaction1.timestamp.getTime() - transaction2.timestamp.getTime())
        const sources = new Set(transactions.map(t => t.source))
        const targets = new Set(transactions.map(t => t.target))
        const wells = sources.difference(targets)
        const bank = new SafeMap<string, BankEntry>()
        transactions.forEach(t => {
            if (!bank.has(t.source))
                bank.set(t.source, new BankEntry(t.source))
            if (!bank.has(t.target))
                bank.set(t.target, new BankEntry(t.target))

            const sourceEntry = bank.get(t.source)
            const targetEntry = bank.get(t.target)
            const cost = wells.has(t.source) ? t.amountPaid : Math.min(t.amountPaid, Math.max(0, sourceEntry.available))
            if (cost > 0) {
                sourceEntry.send(cost, t.timestamp.getTime())
                targetEntry.receive(cost, t.timestamp.getTime())
            }

            // if (freeFlows.has(t.target)){
            //     const freeFlowSourceEntry = targetEntry
            //     const freeFlowTarget = freeFlows.get(t.target)
            //     if (!bank.has(freeFlowTarget))
            //         bank.set(freeFlowTarget, new BankEntry(freeFlowTarget))
            //     freeFlowSourceEntry.send(cost, MAX_DATE)
            //     bank.get(freeFlowTarget).receive(cost, MAX_DATE)
            // }
        })

        const wellEntries:BankEntry[] = []
        const sinkEntries:BankEntry[] = []
        const middleEntries:BankEntry[] = []
        bank.forEach((entry, nodeId) => {
            if (entry.count > 0)
                if (entry.in == 0)
                    wellEntries.push(entry)
                else if (entry.out == 0)
                    sinkEntries.push(entry)
                else
                    middleEntries.push(entry)
        })

        wellEntries.sort((entry1, entry2) => entry1.firstDate - entry2.firstDate)
        sinkEntries.sort((entry1, entry2) => entry1.firstDate - entry2.firstDate)
        middleEntries.sort((entry1, entry2) => entry1.firstDate - entry2.firstDate)

        return [wellEntries.map(formatWellEntry), middleEntries.map(formatMiddleEntry), sinkEntries.map(formatSinkEntry)]
    }, [props.selectedDataManager.selectedElements, props.selectedDataManager.subSelectedElements, formatMiddleEntry, formatSinkEntry, formatWellEntry])

    return(
        <Card className = {styles.FlowAnalysis} elevation={0}>
            <CardHeader avatar = {<Image src = {statsIcon} alt = '' className = {styles.titleImage} />}
                        title = {'Transaction flow analysis'}
            />
            <CardContent className={styles.analysisBody}>
                {wellsList.length == 0 && middlesList.length == 0 && sinksList.length == 0 ?
                    <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} className={styles.error}><Typography variant={'subtitle1'} align={'center'}>No transactions to plot</Typography></Stack>
                    :
                    <List>
                        <ListItemButton onClick={() => setWellsOpen(!wellsOpen)}>
                            <ListItemText className={styles.listHeader}>Sources</ListItemText> {wellsOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={wellsOpen}>
                            <List component="div" disablePadding>
                                {wellsList}
                            </List>
                        </Collapse>
                        <ListItemButton onClick={() => setMiddleOpen(!middleOpen)}>
                            <ListItemText className={styles.listHeader}>Intermediaries</ListItemText> {middleOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={middleOpen}>
                            <List component="div" disablePadding>
                                {middlesList}
                            </List>
                        </Collapse>
                        <ListItemButton onClick={() => setSinksOpen(!sinksOpen)}>
                            <ListItemText className={styles.listHeader}>Targets</ListItemText> {sinksOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={sinksOpen}>
                            <List component="div" disablePadding>
                                {sinksList}
                            </List>
                        </Collapse>
                    </List>
                }
            </CardContent>
        </Card>
    )
}
