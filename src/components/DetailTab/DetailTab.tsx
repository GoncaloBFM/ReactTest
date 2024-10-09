import React, {SetStateAction} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import {GraphEdge} from "@/types/GraphEdge";
import styles from './DetailTab.module.scss';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import ClearIcon from '@mui/icons-material/Clear';
import {GraphElement} from "@/types/GraphElement";
import {ElementType} from "@/types/ElementType";
import {GraphNode} from "@/types/GraphNode";
import {NodeType} from "@/types/NodeType";
import {PersonNode} from "@/types/PersonNode";
import {GraphManager} from "@/hooks/useGraphDataManager";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";

type Props = {
    selectedElements: Array<GraphElement>
    graphManager: GraphManager
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

    if (props.selectedElements.length == 1 && props.selectedElements[0].elementType == ElementType.node) {
        const node = props.selectedElements[0] as GraphNode
        return (
            <Card className={styles.DetailTab}>
                <CardContent>
                    <Typography sx={{fontSize: 20}} color="text.secondary" gutterBottom>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" size={'small'} onClick={() => {props.graphManager.expandNodeData([node.id])
                            }}><OpenWithIcon/></Button>
                            <Button variant="outlined" size={'small'} onClick={() => {props.graphManager.removeNodeData([node.id])
                            }}><ClearIcon/></Button>
                        </Stack>
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

    if (props.selectedElements.length == 1 && props.selectedElements[0].elementType == ElementType.node) {
        const node = props.selectedElements[0] as GraphNode
        return (
            <Card className={styles.DetailTab}>
                <CardContent>
                    <Typography sx={{fontSize: 20}} color="text.secondary" gutterBottom>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" size={'small'} onClick={() => {props.graphManager.expandNodeData([node.id])
                            }}><OpenWithIcon/></Button>
                            <Button variant="outlined" size={'small'} onClick={() => {props.graphManager.removeNodeData([node.id])
                            }}><ClearIcon/></Button>
                        </Stack>
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


    if (props.selectedElements.length > 1 && props.selectedElements[0].elementType == ElementType.node) {
        return (
            <Card className={styles.DetailTab}>
                <CardContent>
                    <Typography sx={{fontSize: 20}} color="text.secondary" gutterBottom>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" size={'small'} onClick={() => (props.graphManager.expandNodeData(props.selectedElements.map(e => e.id)))}><OpenWithIcon/></Button>
                            <Button variant="outlined" size={'small'} onClick={() => (props.graphManager.removeNodeData(props.selectedElements.map(e => e.id)))}><ClearIcon/></Button>
                        </Stack>
                    </Typography>
                    <Typography variant="h5" component="div">
                        Nodes
                    </Typography>
                    <Typography sx={{mb: 1.5}} color="text.secondary">
                        {props.selectedElements.length} selected
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (props.selectedElements.length == 1 && props.selectedElements[0].elementType == ElementType.edge) {
        const edge = props.selectedElements[0] as GraphEdge
        return (
            <Card className={styles.DetailTab}>
                <CardContent>
                    <Typography sx={{fontSize: 20}} color="text.secondary" gutterBottom>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" size={'small'} onClick={() => {props.graphManager.removeEdgeData([edge.id])
                            }}><ClearIcon/></Button>
                        </Stack>
                    </Typography>
                    <Typography variant="h5" component="div">
                        {edge.type}
                    </Typography>
                    <Typography sx={{mb: 1.5}} color="text.secondary">
                        {edge.id}
                    </Typography>
                    <List dense={true}>
                        {edge.timestamp &&
                        <ListItem key={'timestamp'}>
                            <ListItemText secondary={'name'} primary={(edge as TransactionEdge).amountPaid}/>
                        </ListItem>
                        }
                        {edge.type == EdgeType.transaction &&
                            [<ListItem key={'amountPaid'}>
                                <ListItemText secondary={'name'} primary={(edge as TransactionEdge).amountPaid}/>
                            </ListItem>,
                             <ListItem key={'currencyPaid'}>
                                <ListItemText secondary={'name'} primary={(edge as TransactionEdge).currencyPaid}/>
                            </ListItem>]
                        }
                        {generateListElement(edge.data)}
                    </List>
                </CardContent>
            </Card>
        );
    }
}
