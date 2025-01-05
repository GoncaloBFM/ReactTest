import styles from "@/components/FlowAnalysis/FlowAnalysis.module.scss";
import React, {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    ListItem,
    ListItemButton, ListItemIcon,
    Stack,
    Typography
} from "@mui/material";
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
import {CytoscapeManager} from "@/hooks/useCytoscapeManager";
import {GraphData} from "@/types/GraphData";
import {GraphEdge} from "@/types/GraphEdge";
import RotateRightIcon from '@mui/icons-material/RotateRight';

type Props = {
    selectedDataManager: SelectedDataManager
    cytoscapeManager: CytoscapeManager
    graphData: GraphData
}

export function PatternAnalysis(props: Props) {
    return(
        <Card className = {styles.PatternAnalysis} elevation={0}>
            <CardHeader avatar = {<Image src = {statsIcon} alt = '' className = {styles.titleImage} />}
                        title = {'Transaction flow analysis'}
            />
            <CardContent className={styles.analysisBody}>
                <ListItemButton>
                    <ListItemIcon>
                        <RotateRightIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sent mail" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <RotateRightIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                </ListItemButton>
            </CardContent>
        </Card>
    )
}
