import {GraphElement} from "@/types/GraphElement";
import {millisecondsToDHM} from "@/utils/time";
import {arrayMax, arrayMin, sortDescend} from "@/utils/array";
import {ElementType} from "@/types/ElementType";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {mean, std, sum} from "@/utils/math";
import {Card, CardContent, CardHeader, Stack, Typography} from "@mui/material";
import styles from './Summary.module.scss'
import Image from "next/image";
import statsIcon from "../../../public/graph.svg";
import summaryIcon from "../../../public/summary.svg";
import React, {useMemo} from "react";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {GraphData} from "@/types/GraphData";
import ListItemText from "@mui/material/ListItemText";
// @ts-ignore
import Grid from '@mui/material/Grid2';


type Props = {
    graphData: GraphData
    selectedDataManager: SelectedDataManager
};

const NOTHING_TO_SHOW = <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} className={styles.error}><Typography variant={'subtitle1'} align={'center'}>No transactions to summarize</Typography></Stack>

export function Summary(props: Props) {
    const selectedElements = props.selectedDataManager.selectedElements
    const subSelectedElements = props.selectedDataManager.subSelectedElements
    const graphData = props.graphData

    const summary = useMemo(() => {
        const data = selectedElements.length == 0 && subSelectedElements.length == 0
            ? graphData.edgesList
            : subSelectedElements.length == 0 ? selectedElements : subSelectedElements
        if (data.length == 0)
            return NOTHING_TO_SHOW
        if (data[0].elementType == ElementType.edge) {
            const transactions = data.filter(edge => edge.type == EdgeType.transaction) as TransactionEdge[]
            if (transactions.length <= 1)
                return NOTHING_TO_SHOW
            const transactionAmounts = transactions.map(edge => edge.amountPaid)
            const transactionsMils = sortDescend(transactions.map(edge => edge.timestamp.getTime()))
            const totalTimeElapsed = millisecondsToDHM(transactionsMils[0] - transactionsMils[transactionsMils.length - 1])
            const timeDifferencePairs = new Array<number>()
            for(let i=0; i < transactionsMils.length - 1; i++){
                timeDifferencePairs.push(transactionsMils[i] - transactionsMils[i + 1])
            }
            const avgTimeElapsed = millisecondsToDHM(mean(timeDifferencePairs))

            return <Grid container className={styles.summaryGrid} spacing={0} columns={2}>
                <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Number of transactions'} secondary={transactionAmounts.length}/>
                </Grid>
                <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Total money transferred'}
                                  secondary={sum(transactionAmounts).toFixed(2) + ' USD'}/>
                </Grid>
                <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Average amount transferred'}
                                  secondary={mean(transactionAmounts).toFixed(2) + ' USD'}/>
                </Grid>
                <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'STD of amount transferred'}
                                  secondary={std(transactionAmounts).toFixed(2) + ' USD'}/>
                </Grid>
                <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Total time between transactions'} secondary={`${totalTimeElapsed.days} days; ${totalTimeElapsed.hours} hour; ${totalTimeElapsed.minutes} min`}/>
                </Grid>
                <Grid size={1}>
                    <ListItemText className={styles.summaryEntryy} primary={'Average time between transactions'} secondary={
                        `${avgTimeElapsed.days} days; ${avgTimeElapsed.hours} hour; ${avgTimeElapsed.minutes} min`
                    }/>
                </Grid>
            </Grid>
        } else {
            const nodeIds = data.map(node => node.id)
            const inTransactions = new Array<TransactionEdge>()
            const outTransactions = new Array<TransactionEdge>()

            graphData.edgesList.forEach(e=> {
                    if (e.type == EdgeType.transaction) {
                        if (nodeIds.includes(e.target))
                            inTransactions.push(e as TransactionEdge)
                        if (nodeIds.includes(e.source))
                            outTransactions.push(e as TransactionEdge)
                    }
                }
            )

            if ((inTransactions.length <= 1) && (outTransactions.length <= 1))
                return NOTHING_TO_SHOW

            const inTransactionsAmounts = inTransactions.map(e => e.amountPaid)
            const outTransactionsAmounts = outTransactions.map(e => e.amountPaid)
            const totalInTransactionsAmounts = sum(inTransactionsAmounts)
            const totalOutTransactionsAmounts = sum(outTransactionsAmounts)
            const inTransactionsMils = inTransactions.map(edge => edge.timestamp.getTime())
            const outTransactionsMils = outTransactions.map(edge => edge.timestamp.getTime())
            const inTransactionsTimeElapsed = millisecondsToDHM(arrayMax(inTransactionsMils) - arrayMin(inTransactionsMils))
            const outTransactionsTimeElapsed = millisecondsToDHM(arrayMax(outTransactionsMils) - arrayMin(outTransactionsMils))

            return <Grid container className={styles.summaryGrid} spacing={0} columns={2}>
                <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Number of transactions'} secondary={
                        `${inTransactionsAmounts.length} inbound; ${outTransactionsAmounts.length} outbound`
                    }/>
                </Grid>
                <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Net amount'} secondary={(totalInTransactionsAmounts - totalOutTransactionsAmounts).toFixed(2) + ' USD'}/>
                </Grid>
                {<Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Total inbound amount'} secondary={totalInTransactionsAmounts.toFixed(2) + ' USD'}/>
                </Grid>}
                {<Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Total outbound amount'} secondary={totalOutTransactionsAmounts.toFixed(2) + ' USD'}/>
                </Grid >}
                {inTransactions.length > 1 && <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Total time between inbound transactions'} secondary={`${inTransactionsTimeElapsed.days} days; ${inTransactionsTimeElapsed.hours} hour; ${inTransactionsTimeElapsed.minutes} min`}/>
                </Grid>}
                {outTransactions.length > 1 && <Grid size={1}>
                    <ListItemText className={styles.summaryEntry} primary={'Total time between outbound transactions'} secondary={`${outTransactionsTimeElapsed.days} days; ${outTransactionsTimeElapsed.hours} hour; ${outTransactionsTimeElapsed.minutes} min`}/>
                </Grid>}
            </Grid>
        }
    }, [graphData, selectedElements, subSelectedElements])

    return <Card className = {styles.Summary} elevation={0}>
        <CardHeader avatar = {<Image src = {summaryIcon} alt = '' className = {styles.summaryImage} />}
                    title = 'Transactions summary'
        />
        <CardContent sx={{'&:last-child': { paddingBottom: 0 }}} className={styles.summaryBody}>
            {summary}
        </CardContent>
    </Card>
}