import styles from "@/components/FlowAnalysis/FlowAnalysis.module.scss";
import React, {Dispatch, SetStateAction, useMemo} from "react";
import {Button, Card, CardContent, CardHeader, Collapse, ListItem, ListItemButton, Stack} from "@mui/material";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import Image from "next/image";
import statsIcon from "../../../public/stats.svg";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {SafeMap} from "@/utils/SafeMap";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {datetimeToString} from "@/utils/time";
import {bifurcateBy} from "@/utils/array";

type Props = {
    selectedDataManager: SelectedDataManager
}

type BankEntry = {nodeId: string, out:number, in:number, available: number, firstDate: number}

const MAX_DATE = 8640000000000000

export function FlowAnalysis(props: Props) {
    const [wellsOpen, setWellsOpen] = React.useState(true);
    const [sinksOpen, setSinksOpen] = React.useState(true);
    const [middleOpen, setMiddleOpen] = React.useState(true);

    const formatWellEntry = (e: BankEntry) => <ListItemText key={e.nodeId} className={styles.entry} secondary={`Out: ${e.out.toFixed(2)}`} primary={`${e.nodeId} (first active: ${datetimeToString(new Date(e.firstDate))})`}></ListItemText>
    const formatMiddleEntry = (e: BankEntry) => <ListItemText onMouseEnter={()=> {}} onMouseLeave={() => {}} onClick={()=>{}} key={e.nodeId} className={styles.entry} secondary={`In ${e.in.toFixed(2)} Out: ${e.out.toFixed(2)} Net: ${e.available.toFixed(2)}`} primary={`${e.nodeId} (first active: ${datetimeToString(new Date(e.firstDate))})`}></ListItemText>
    const formatSinkEntry = (e: BankEntry) => <ListItemText key={e.nodeId} className={styles.entry} secondary={`In ${e.in.toFixed(2)}`} primary={`${e.nodeId} (first active: ${datetimeToString(new Date(e.firstDate))})`}></ListItemText>

    const [wellsList, middlesList, sinksList] = useMemo(() => {
        const data = props.selectedDataManager.subSelectedElements.length == 0 ? props.selectedDataManager.selectedElements : props.selectedDataManager.subSelectedElements
        const [rawTransactions, nonTransactions] = bifurcateBy(data, edge => edge.type == EdgeType.transaction)
        const transactions = rawTransactions as TransactionEdge[]
        transactions.sort((transaction1, transaction2) => transaction1.timestamp.getTime() - transaction2.timestamp.getTime())
        const sources = new Set(transactions.map(t => t.source))
        const targets = new Set(transactions.map(t => t.target))
        const wells = sources.difference(targets)
        const sinks = targets.difference(sources)
        const bank = new SafeMap<string, BankEntry>()
        transactions.forEach(t => {
            if (!bank.has(t.source))
                bank.set(t.source, {nodeId: t.source, out:0, in:0, available:0, firstDate: MAX_DATE})
            if (!bank.has(t.target))
                bank.set(t.target, {nodeId: t.target, out:0, in:0, available:0, firstDate: MAX_DATE})

            const sourceEntry = bank.get(t.source)
            const targetEntry = bank.get(t.target)
            const cost = wells.has(t.source) ? t.amountPaid : Math.min(t.amountPaid, Math.max(0, sourceEntry.available))
            if (cost > 0) {
                bank.set(t.source, {
                    nodeId: sourceEntry.nodeId,
                    out: sourceEntry.out + cost,
                    in: sourceEntry.in,
                    available: sourceEntry.available - cost,
                    firstDate: Math.min(sourceEntry.firstDate, t.timestamp.getTime())
                })
                bank.set(t.target, {
                    nodeId: targetEntry.nodeId,
                    out: targetEntry.out,
                    in: targetEntry.in + cost,
                    available: targetEntry.available + cost,
                    firstDate: Math.min(targetEntry.firstDate, t.timestamp.getTime())
                })
            }
        })

        const wellEntries:BankEntry[] = []
        const sinkEntries:BankEntry[] = []
        const middleEntries:BankEntry[] = []
        bank.forEach((entry, nodeId) => {
            if (wells.has(nodeId))
                wellEntries.push(entry)
            else if(sinks.has(nodeId))
                sinkEntries.push(entry)
            else
                middleEntries.push(entry)
        })

        wellEntries.sort((entry1, entry2) => entry1.firstDate - entry2.firstDate)
        sinkEntries.sort((entry1, entry2) => entry1.firstDate - entry2.firstDate)
        middleEntries.sort((entry1, entry2) => entry1.firstDate - entry2.firstDate)

        return [wellEntries.map(formatWellEntry), middleEntries.map(formatMiddleEntry), sinkEntries.map(formatSinkEntry)]
    }, [props.selectedDataManager.selectedElements, props.selectedDataManager.subSelectedElements])

    return(
        <Card className = {styles.FlowAnalysis} elevation={0}>
            <CardHeader avatar = {<Image src = {statsIcon} alt = '' className = {styles.titleImage} />}
                        title = {'Transaction flow analysis'}
            />
            <CardContent className={styles.histogramBody}>
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
            </CardContent>
        </Card>
    )
}
