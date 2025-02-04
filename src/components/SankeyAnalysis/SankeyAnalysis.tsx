import {Button, Card, CardContent, CardHeader, MenuItem, Select, Stack, Typography} from "@mui/material";
import styles from './SankeyAnalysis.module.scss'
import Image from "next/image";
import watchIcon from "../../../public/watch.svg";
import React, {useMemo, useState} from "react";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {GraphData} from "@/types/GraphData";
import {Sankey} from "@/components/Sankey/Sankey";
import {ElementType} from "@/types/ElementType";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {MouseTracker} from "@/components/MouseTracker/MouseTracker";


type Props = {
    graphData: GraphData
    selectedDataManager: SelectedDataManager
};

const NOTHING_TO_SHOW = <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} className={styles.error}><Typography variant={'subtitle1'} align={'center'}>No transactions to summarize</Typography></Stack>



export function SankeyAnalysis(props: Props) {
    const selectedElements = props.selectedDataManager.selectedElements
    const subSelectedElements = props.selectedDataManager.subSelectedElements
    const graphData = props.graphData

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
            const groupByTime = Object.groupBy(transactions, e => {
                const time = new Date(e.timestamp.getTime())
                entities.add(e.target)
                entities.add(e.source)
                time.setHours(0, 0, 0, 0)
                return time.getTime()
            })
            return <Sankey graphData={props.graphData} selectedDataManager={props.selectedDataManager}></Sankey>
        }
        return NOTHING_TO_SHOW
    },[])

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
            {/*{content}*/}
            <Stack>
                <Sankey></Sankey>
            </Stack>

        </CardContent>
    </Card>
}