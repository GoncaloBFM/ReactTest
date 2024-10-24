import React, {SetStateAction, useMemo} from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton, ListItemButton, ListItemIcon,
} from "@mui/material";
import {GraphManager} from "@/hooks/useGraphDataManager";
import {SelectedDataManager} from "@/hooks/useSelectedDataManager";
import Image from 'next/image'
import styles from './DetailTab.module.scss'

type Props = {
    selectedDataManager: SelectedDataManager;
    graphManager: GraphManager
};

export function DetailTab(props: Props) {

    const subSelectedElements = props.selectedDataManager.subSelectedElements;
    const selectedElements = props.selectedDataManager.selectedElements;

    //const [avatar, title, subHeader] = useMemo(() => {
    //}, [subSelectedElements, selectedElements])

    return (
        <Card className={styles.DetailTab}>
            {/*<CardHeader*/}
            {/*    avatar={*/}
            {/*        <Image src='account.svg' alt='' width={50} height={50}/>*/}
            {/*    }*/}
            {/*    title='Account'*/}
            {/*    subheader='Owner: John Michael'*/}
            {/*/>*/}
            <CardHeader
                avatar={
                    <Image src='person.svg' alt='' className={styles.avatarImage}/>
                }
                title='Person'
                subheader='Name: John Michael'
            />
            <CardContent>
                <List dense={true}
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItemButton>
                        <ListItemIcon>
                            Icon
                        </ListItemIcon>
                        <ListItemText primary="Sent mail" />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            Icon
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            Icon
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItemButton>
                </List>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    Icon
                </IconButton>
                <IconButton aria-label="share">
                    Icon
                </IconButton>
            </CardActions>
        </Card>
    );
}
