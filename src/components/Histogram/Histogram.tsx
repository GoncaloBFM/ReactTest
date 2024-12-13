// @ts-ignore
import Plot from 'react-plotly.js';
import styles from './Histogram.module.scss'
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {GraphData} from "@/types/GraphData";
import {Button, Card, CardContent, CardHeader, IconButton, Stack, Typography} from "@mui/material";
import Image from "next/image";
import graphIcon from "../../../public/graph.svg";
import React, {useCallback, useMemo, useState} from "react";
import {ElementType} from "@/types/ElementType";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {sum} from "@/utils/math";
import {GraphNode} from "@/types/GraphNode";

type Props = {
    selectedDataManager: SelectedDataManager
    graphData: GraphData
};

const MIN_DATE = new Date(-8640000000000000)
const MAX_DATE = new Date(8640000000000000)

const NOTHING_TO_SHOW = <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} className={styles.error}><Typography variant={'subtitle1'} align={'center'}>No transactions to plot</Typography></Stack>

export function Histogram(props:Props) {
    const selectedElements = props.selectedDataManager.selectedElements
    const setSelectedElements = props.selectedDataManager.setSelectedElements
    const subSelectedElements = props.selectedDataManager.subSelectedElements
    const setSubSelectedElements = props.selectedDataManager.setSubSelectedElements
    const graphData = props.graphData
    const [histogramToggle, setHistogramToggle] = useState(false)


    const onPlotClick = useCallback((e: any) => {
                const selected = (e.points[0].customdata as unknown as string[]).map((edgeId: string) => graphData.edgesMap.get(edgeId))
                setSelectedElements(selected)
                setSubSelectedElements(selected)
            }
    , [graphData, setSelectedElements, setSubSelectedElements])

    const generatePlotLayout = useCallback((minXAxis: Date, maxXAxis: Date, minYAxis: number, maxYAxis:number, logYAxis: boolean) => {
        return {
                margin: {l: 40, r: 40, t: 0, b: 0},
                barmode: 'relative',
                xaxis: {
                    autorange: true,
                    range: [minXAxis, maxXAxis],
                    fixedrange: true,
                    tickformatstops: [ //TODO: fix bug with dynamic number of x tick labels
                        {dtickrange:[null, 604800000], value:"%e %b\n%Y"},
                        {dtickrange:[604800000, "M1"], value:"%e %b\n%Y"},
                        {dtickrange:["M1", "M12"], value:"%b '%y"},
                        {dtickrange:["M12", null], value:"%Y"}
                    ],
                    rangeslider: {range: [minXAxis, maxXAxis]}, //set min for range slider
                    ticks:'outside',
                    type: 'date'
                } as any,
                yaxis: {
                    autorange: true,
                    range: [minYAxis, maxYAxis],
                    type: logYAxis ? 'log' : 'linear'
                }
            }
    }, [])


    const generateDoublePlot = useCallback((
        x1: Date[],
        x2: Date[],
        y1: number[],
        y2: number[],
        minXAxis: Date,
        maxXAxis: Date,
        minYAxis: number,
        maxYAxis: number,
        ids1: string[][],
        ids2: string[][],
        logYAxis: boolean
    ) => <Plot
        data={[
            {
                type: "bar",
                x: x1,
                y: y1,
                name:"in",
                customdata:ids1
            },
            {
                type: "bar",
                x: x2,
                y: y2,
                name:"out",
                customdata:ids2
            },
        ]}
        useResizeHandler={true}
        className={styles.plot}
        config={{responsive: true, displayModeBar: false}}
        onClick={onPlotClick}
        layout={generatePlotLayout(minXAxis, maxXAxis, minYAxis, maxYAxis, logYAxis) as any}
        onLegendClick={(e:any)=> {
            if (e.curveNumber == 0)
                return (e.fullData[1].visible == true)
            else
                return (e.fullData[0].visible == true)
        }}
        onLegendDoubleClick={()=>false}
    />, [onPlotClick, generatePlotLayout])

    const generateSinglePlot = useCallback((
        x: Date[],
        y: number[],
        minXAxis: Date,
        maxXAxis: Date,
        maxYAxis: number,
        ids: string[][],
        logYAxis: boolean
    ) => <Plot
            data={[
                {
                    type: "bar",
                    x: x,
                    y: y,
                    customdata:ids
                },
            ]}
            useResizeHandler={true}
            className={styles.plot}
            config={{responsive: true, displayModeBar: false}}
            onClick={onPlotClick}
            layout={generatePlotLayout(minXAxis, maxXAxis, 0, maxYAxis, logYAxis) as any}
        />, [generatePlotLayout, onPlotClick])

    const calculatePlotData = useCallback((transactions: TransactionEdge[]) => {
        const sortedTransactions = transactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        const groupByTime = Object.groupBy(sortedTransactions, e => {
            const time = new Date(e.timestamp.getTime())
            time.setHours(0,0,0,0)
            return time.getTime()
        })
        const xAxis:Date[] = []
        const yCount = []
        const yTotal = []
        const ids = []
        const minXAxis = sortedTransactions.length == 0 ? MAX_DATE : new Date(sortedTransactions[0].timestamp.getTime())
        minXAxis.setHours(0,0,0,0)
        const maxXAxis = sortedTransactions.length == 0 ? MIN_DATE : new Date(sortedTransactions[sortedTransactions.length - 1].timestamp.getTime())
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
            ids.push(transactionsGroup.map(edge => edge.id))
            minYCountAxis = Math.min(minYCountAxis, length)
            maxYCountAxis = Math.max(maxYCountAxis, length)
            minYTotalAxis = Math.min(minYTotalAxis, total)
            maxYTotalAxis = Math.max(maxYTotalAxis, total)
        }
        return {xAxis, yCount, yTotal, minXAxis, maxXAxis, minYCountAxis, maxYCountAxis, minYTotalAxis, maxYTotalAxis, ids}
    }, [])

    const generateTransactionPlots = useCallback((transactions: TransactionEdge[]) => {
            const plotData = calculatePlotData(transactions)
            return [
                generateSinglePlot(plotData.xAxis, plotData.yCount, plotData.minXAxis, plotData.maxXAxis, plotData.maxYCountAxis, plotData.ids, false),
                generateSinglePlot(plotData.xAxis, plotData.yTotal, plotData.minXAxis, plotData.maxXAxis, plotData.maxYTotalAxis, plotData.ids, false)
            ]
        }, [calculatePlotData, generateSinglePlot])


    const generateNodePlots =  useCallback((inTransactions: TransactionEdge[], outTransactions: TransactionEdge[]) => {
        const inPlotData =  calculatePlotData(inTransactions)
        const outPlotData = calculatePlotData(outTransactions)

        return [generateDoublePlot(
            inPlotData.xAxis,
            outPlotData.xAxis,
            inPlotData.yCount,
            outPlotData.yCount.map(n => -n),
            new Date(Math.min(inPlotData.minXAxis.getTime(), outPlotData.minXAxis.getTime())),
            new Date(Math.max(inPlotData.maxXAxis.getTime(), outPlotData.maxXAxis.getTime())),
            -outPlotData.maxYCountAxis,
            inPlotData.maxYCountAxis,
            inPlotData.ids,
            outPlotData.ids,
            false,
        ), generateDoublePlot(
            inPlotData.xAxis,
            outPlotData.xAxis,
            inPlotData.yTotal,
            outPlotData.yTotal.map(n => -n),
            new Date(Math.min(inPlotData.minXAxis.getTime(), outPlotData.minXAxis.getTime())),
            new Date(Math.max(inPlotData.maxXAxis.getTime(), outPlotData.maxXAxis.getTime())),
            -outPlotData.maxYTotalAxis,
            inPlotData.maxYTotalAxis,
            inPlotData.ids,
            outPlotData.ids,
            false,
        )]
    }, [calculatePlotData, generateDoublePlot])

    const generatePlot = useMemo(() => {
        const data = selectedElements.length == 0 && subSelectedElements.length == 0
            ? []
            : subSelectedElements.length == 0 ? selectedElements : subSelectedElements

        if (data.length > 0) {
           if (data[0].elementType == ElementType.edge) {
               const transactions = data.filter(edge => edge.type == EdgeType.transaction) as TransactionEdge[]
               if (data.length == 1) {
                   return NOTHING_TO_SHOW
               }
               const [countPlot, totalPlot] = generateTransactionPlots(transactions as TransactionEdge[])
               return histogramToggle ? countPlot : totalPlot
           } else {
               const nodes = data as GraphNode[]
               const nodeIds = nodes.map(node => node.id)
               const inTransactions = new Array<TransactionEdge>()
               const outTransactions = new Array<TransactionEdge>()
               graphData.edgesList.forEach(e=> {
                   if (e.type == EdgeType.transaction) {
                       if (nodeIds.includes(e.target))
                           inTransactions.push(e as TransactionEdge)
                       if (nodeIds.includes(e.source))
                           outTransactions.push(e as TransactionEdge)
                   }
               })
               if (inTransactions.length == 0 && outTransactions.length == 0) {
                   return NOTHING_TO_SHOW
               }
               const [countPlot, totalPlot] = generateNodePlots(inTransactions, outTransactions)
               return histogramToggle ? countPlot : totalPlot
           }
        }
        return NOTHING_TO_SHOW
    }, [graphData, generateTransactionPlots, generateNodePlots, histogramToggle, selectedElements, subSelectedElements])

    return  <Card className = {styles.Histogram} elevation={0}>
    <CardHeader avatar = {<Image src = {graphIcon} alt = '' className = {styles.titleImage} />}
                title = {histogramToggle ? 'Transaction count plot' : 'Total transferred plot'}
                action={
        <Button size={'small'} onClick={() => setHistogramToggle(!histogramToggle)}>
            Show {histogramToggle ? 'amount' : 'count'}
        </Button>}
    />
    <CardContent className={styles.histogramBody}>
        {generatePlot}
    </CardContent>
    </Card>
}
