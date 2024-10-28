import React, {useState} from 'react';
import {AppBar, Button, Divider, FormControl, MenuItem, Select, Stack, Toolbar} from "@mui/material";
import styles from './DashboardHeader.module.scss'
import {LoadDataPopup} from "@/components/LoadDataPopup/LoadDataPopup";
import {CytoscapeManager} from '@/hooks/useCytoscapeManager';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider, TimeField} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

type Props = {
    onSubmitLoadDataPopup: (nodeIds: Array<string>) => Promise<void>
    cytoscapeManager: CytoscapeManager,
};

export function DashboardHeader(props: Props) {
    const [currencyBehavior, setCurrencyBehavior] = useState('filter');
    const [currency, setCurrency] = useState('USD');
    const [isLoadDataPopupOpen, setLoadDataPopupOpen] = useState(false);

    return (
        <div className={styles.DashboardHeader}>
                <Stack direction="row" alignItems='center' justifyContent="space-between" spacing={1} className={styles.headerStack}>
                    <img src='/logo.svg' className={styles.logo}></img>
                    <Stack direction="row" spacing={1}>
                        <Button  size={'small'} onClick={() => setLoadDataPopupOpen(true)}>
                            <DownloadIcon/> Load data
                        </Button>
                        <LoadDataPopup
                            onSubmit={props.onSubmitLoadDataPopup}
                            isOpen={isLoadDataPopupOpen}
                            setOpen={setLoadDataPopupOpen}></LoadDataPopup>
                    </Stack>
                </Stack>
        </div>
    );
}
