import React from 'react';
import {Button, Stack} from "@mui/material";
import styles from './DashboardHeader.module.scss'
import {LoadDataPopup} from "@/components/LoadDataPopup/LoadDataPopup";

export function DashboardHeader() {
    const [isOpen, setLoadDataPopupOpen] = React.useState(false);

    return (
        <Stack direction="row" spacing={2} justifyContent="space-between" className={styles.DashboardHeader}>
            <span className={styles.logo}> AMLVis </span>
            <Button variant="outlined" onClick={() => setLoadDataPopupOpen(true)}>Load data</Button>
            <LoadDataPopup onClose={() => setLoadDataPopupOpen(false)} isOpen={isOpen}></LoadDataPopup>
        </Stack>
    );
}
