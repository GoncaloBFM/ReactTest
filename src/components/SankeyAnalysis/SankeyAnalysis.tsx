import {Button, Card, CardContent, CardHeader, MenuItem, Select, Stack, Typography} from "@mui/material";
import styles from './SankeyAnalysis.module.scss'
import Image from "next/image";
import watchIcon from "../../../public/watch.svg";
import React, {Dispatch, SetStateAction, useMemo, useState} from "react";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {GraphData} from "@/types/GraphData";
import {SankeyLinkCol, Sankey, SankeyLink} from "@/components/Sankey/Sankey";
import {ElementType} from "@/types/ElementType";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {MouseTracker} from "@/components/MouseTracker/MouseTracker";
import {dateToString, millisecondsToDHM} from "@/utils/time";
import {CytoscapeManager} from "@/hooks/useCytoscapeManager";
import {AnalysisTab} from "@/types/AnalysisTab";


type Props = {
    graphData: GraphData
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    setShowAnalysisTab: Dispatch<SetStateAction<AnalysisTab>>
};

const NOTHING_TO_SHOW = <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} className={styles.error}><Typography variant={'subtitle1'} align={'center'}>No transactions to visualize</Typography></Stack>

export function SankeyAnalysis(props: Props) {
    const cytoscapeManager = props.cytoscapeManager
    const selectedDataManager = props.selectedDataManager
    const selectedElements = props.selectedDataManager.selectedElements
    const subSelectedElements = props.selectedDataManager.subSelectedElements
    const graphData = props.graphData
    const setShowAnalysisTab = props.setShowAnalysisTab

    const content = useMemo(() => {
        const data = selectedElements.length == 0 && subSelectedElements.length == 0
            ? []
            : subSelectedElements.length == 0 ? selectedElements : subSelectedElements

        if (data.length > 0 && data[0].elementType == ElementType.edge) {
            const transactions = data.filter(edge => edge.type == EdgeType.transaction) as TransactionEdge[]
            if (data.length == 0) {
                return NOTHING_TO_SHOW
            }
            const entities = new Set<string>()
            let minTimeMs = Number.MAX_SAFE_INTEGER
            let maxTimeMs = Number.MIN_SAFE_INTEGER
            const groupByTime = Object.groupBy(transactions, e => {
                const time = new Date(e.timestamp.getTime())
                entities.add(e.target)
                entities.add(e.source)
                time.setHours(0, 0, 0, 0)
                minTimeMs = Math.min(time.getTime(), minTimeMs)
                maxTimeMs = Math.max(time.getTime(), maxTimeMs)
                return dateToString(time)
            })

            const minTime = new Date(minTimeMs)
            const maxTime = new Date(maxTimeMs)
            let time = minTime
            let linkCols = []
            while (time <= maxTime) {
                const timeString = dateToString(time)
                const dayTransactions = groupByTime[timeString]
                if (dayTransactions == undefined) {
                    linkCols.push({links:[], label:timeString})
                } else {
                    const linkCol = Object.values(dayTransactions.reduce(
                        (acc: {[key: string]: SankeyLink}, transaction) => {
                            const index = transaction.source + '_' + transaction.target
                            const link = acc[index]
                            if (link == undefined) {
                                acc[index] = {target: transaction.target, source: transaction.source, count: 1, amount: transaction.amountPaid}
                            } else {
                                acc[index] = {target: link.target, source: link.source, count: link.count + 1, amount: transaction.amountPaid + link.amount}
                            }
                            return acc
                        }, {} as {[key: string]: SankeyLink}
                    ))
                    linkCols.push({label:timeString, links: linkCol})
                }
                time.setDate(time.getDate() + 1)
            }

            const nodes = Object.fromEntries(entities.values().map((entity, i) => [entity, {order:i}]))
            return <Sankey setShowAnalysisTab={setShowAnalysisTab} graphData={graphData} cytoscapeManager={cytoscapeManager} selectedDataManager={selectedDataManager} nodes={nodes} linkCols={linkCols}></Sankey>
        }
        return NOTHING_TO_SHOW
    },[selectedElements, subSelectedElements, cytoscapeManager, selectedDataManager])

    return <Card className = {styles.SankeyAnalysis} elevation={0}>
        <CardHeader avatar = {<Image src = {watchIcon} alt = '' className = {styles.summaryImage} />}
                    title = 'Timeline Analysis'
                    action={
                        <Select size={'small'} defaultValue={'Day'} onClick={() => null}>
                            <MenuItem value={'Day'}>Days</MenuItem>
                            <MenuItem value={'Week'}>Weeks</MenuItem>
                            <MenuItem value={'Month'}>Months</MenuItem>
                            <MenuItem value={'Year'}>Years</MenuItem>
                        </Select>}
        />
        <CardContent className={styles.cardBody}>
            {content}
        </CardContent>
    </Card>
}
