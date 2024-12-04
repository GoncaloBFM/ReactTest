import styles from "@/components/BasicAnalysis/BasicAnalysis.module.scss";
import React, {Dispatch, SetStateAction} from "react";
import {Stack} from "@mui/material";
import {Histogram} from "@/components/Histogram/Histogram";
import Divider from "@mui/material/Divider";
import {Summary} from "@/components/Summary/Summary";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import {GraphData} from "@/types/GraphData";

type Props = {
    selectedDataManager: SelectedDataManager
    graphData: GraphData
}

export function BasicAnalysis(props: Props) {
    return(
        //TODO: Data should be calculated here and fed to child components
        <Stack direction='column' className={styles.BasicAnalysis}>
            <div className={styles.histogram}>
                <Histogram selectedDataManager={props.selectedDataManager} graphData={props.graphData}/>
            </div>
            <Divider/>
            <div className={styles.summary}>
                <Summary
                    selectedDataManager={props.selectedDataManager}
                    graphData={props.graphData}/>
            </div>
        </Stack>
    )
}