import React, {SetStateAction} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {Button, Card, CardContent, Typography} from "@mui/material";
import {GraphEdge} from "@/types/GraphEdge";
import styles from './DetailTab.module.scss';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import ClearIcon from '@mui/icons-material/Clear';
import {GraphElement} from "@/types/GraphElement";
import {ElementType} from "@/types/ElementType";
import {GraphNode} from "@/types/GraphNode";
import {NodeType} from "@/types/NodeType";
import {PersonNode} from "@/types/PersonNode";

type Props = {
    selectedElements: Array<GraphElement>
    expandNodeData: (nodeId: string) => void
    removeNodeData: (nodeIds: Array<string>) => void
};

export function DetailTab(props: Props) {
    const generateListElement = (element: Record<string, any>) => {
        const properties = Object.keys(element).sort()
        return properties.map((property: string) =>
            <ListItem key={property}>
                <ListItemText secondary={property} primary={element[property]}/>
            </ListItem>
        )
    }

    if (props.selectedElements.length === 0 || props.selectedElements[0].elementType !== ElementType.node) {
        return
    }

    const node = props.selectedElements[0] as GraphNode
    return (
        <Card className={styles.GraphVisualization}>
            <CardContent>
                <Typography sx={{fontSize: 20}} color="text.secondary" gutterBottom>
                    <Button variant="outlined" size={'small'} onClick={() => {
                        props.selectedElements && props.expandNodeData(node.id)
                    }}><OpenWithIcon/></Button>
                    <Button variant="outlined" size={'small'} onClick={() => {
                        props.selectedElements && props.removeNodeData([node.id])
                    }}><ClearIcon/></Button>
                </Typography>
                <Typography variant="h5" component="div">
                    {node.type}
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    {node.id}
                </Typography>
                <List dense={true}>
                    {node.type == NodeType.person &&
                        <ListItem key={'name'}>
                            <ListItemText secondary={'name'} primary={(node as PersonNode).name}/>
                        </ListItem>
                    }
                    {generateListElement(node.data)}
                </List>
            </CardContent>
        </Card>
    );
}
