// @ts-ignore
import Plot from 'react-plotly.js';
import styles from './Histogram.module.scss'
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {GraphData} from "@/types/GraphData";
import {Card, CardContent, CardHeader, IconButton} from "@mui/material";
import Image from "next/image";
import statsIcon from "../../../public/stats.svg";
import React, {useMemo} from "react";
import {ElementType} from "@/types/ElementType";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {sortDescend} from "@/utils/array";
import {sum} from "@/utils/math";
import {bool} from "prop-types";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Props = {
    selectedDataManager: SelectedDataManager
    graphData: GraphData
};

export function Histogram(props:Props) {
    const selectedElements = props.selectedDataManager.selectedElements
    const subSelectedElements = props.selectedDataManager.subSelectedElements
    const graphData = props.graphData

    const generatePlot = (
        x: Date[],
        y: number[],
        minXAxis: Date,
        maxXAxis: Date,
        minYAxis: number,
        maxYAxis: number,
        logYAxis: boolean
    ) => <Plot
            data={[
                {
                    type: "bar",
                    x: x,
                    y: y
                },
            ]}
            useResizeHandler={true}
            className={styles.plot}
            config={{responsive: true, displayModeBar: false}}
            layout={
                {
                    margin: {l: 40, r: 40, t: 0, b: 0},
                    xaxis: {
                        autorange: true,
                        range: [minXAxis, maxXAxis],
                        rangeselector: {buttons: [
                                {
                                    count: 1,
                                    label: '1d',
                                    step: 'day',
                                    stepmode: 'backward'
                                },
                                {
                                    count: 1,
                                    label: '1m',
                                    step: 'month',
                                    stepmode: 'backward'
                                },
                                {
                                    count: 6,
                                    label: '6m',
                                    step: 'month',
                                    stepmode: 'backward'
                                },
                                {
                                    count: 1,
                                    label: '1y',
                                    step: 'year',
                                    stepmode: 'backward'
                                },
                                {step: 'all'}
                            ]},
                        rangeslider: {range: [minXAxis, maxXAxis]}, //set min for range slider
                        type: 'date'
                    },
                    yaxis: {
                        autorange: true,
                        range: [minYAxis, maxYAxis],
                        type: logYAxis ? 'log' : 'linear'
                    }
                }}
        />

    const [countPlot, totalPlot] = useMemo(() => {
        const data = selectedElements.length == 0 && subSelectedElements.length == 0
            ? graphData.edgesList
            : subSelectedElements.length == 0 ? selectedElements : subSelectedElements

        if (data.length == 0) {
            return [<></>, <></>]
        }

        if (data[0].elementType == ElementType.edge) {
            const transactions = data.filter(edge => edge.type == EdgeType.transaction) as TransactionEdge[]
            if (transactions.length <= 1) {
                return [<></>, <></>]
            }
            const sortedTransactions = transactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            const groupByTime = Object.groupBy(sortedTransactions, e => {
                const time = new Date(e.timestamp.getTime())
                time.setHours(0,0,0,0)
                return time.getTime()
            })
            const xAxis = []
            const yCount = []
            const yTotal = []
            const minXAxis = new Date(sortedTransactions[0].timestamp.getTime())
            minXAxis.setHours(0,0,0,0)
            const maxXAxis = new Date(sortedTransactions[sortedTransactions.length - 1].timestamp.getTime())
            maxXAxis.setHours(0,0,0,0)
            let minYCountAxis = Infinity
            let maxYCountAxis = -Infinity
            let minYTotalAxis = Infinity
            let maxYTotalAxis = -Infinity
            for (const timeString in groupByTime) {
                const time = new Date(Number(timeString))
                const transactionsGroup = groupByTime[timeString] as TransactionEdge[]
                const length = transactionsGroup.length
                const total = sum(transactionsGroup.map(e => e.amountPaid))
                xAxis.push(new Date(time))
                yCount.push(length)
                yTotal.push(total)
                minYCountAxis = Math.min(minYCountAxis, length)
                maxYCountAxis = Math.max(maxYCountAxis, length)
                minYTotalAxis = Math.min(minYTotalAxis, total)
                maxYTotalAxis = Math.max(maxYTotalAxis, total)
            }
            return [
                generatePlot(xAxis, yCount, minXAxis, maxXAxis, minYCountAxis, maxYCountAxis, false),
                generatePlot(xAxis, yTotal, minXAxis, maxXAxis, minYTotalAxis, maxYTotalAxis, true)
            ]
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
            return [<></>, <></>]
        }
    }, [selectedElements, graphData, subSelectedElements])

    return  <Card className = {styles.Histogram} elevation={0}>
    <CardHeader avatar = {<Image src = {statsIcon} alt = '' className = {styles.titleImage} />}
                title = 'Transactions plot'
                        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
    />
        
    <CardContent className={styles.histogramBody}>
        {totalPlot}
    </CardContent>
    </Card>
}
