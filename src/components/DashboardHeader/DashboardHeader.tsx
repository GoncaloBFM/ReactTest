import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import {
    AppBar,
    Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider,
    FormControl,
    FormControlLabel, InputLabel, ListItem, Menu,
    MenuItem, OutlinedInput,
    Select, SelectChangeEvent,
    Stack,
    Switch,
    Toolbar, Typography
} from "@mui/material";
import styles from './DashboardHeader.module.scss'
import {LoadDataPopup} from "@/components/LoadDataPopup/LoadDataPopup";
import {CytoscapeManager} from '@/hooks/useCytoscapeManager';
import DownloadIcon from '@mui/icons-material/Download';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import SettingsIcon from '@mui/icons-material/Settings';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {DateTimePicker, LocalizationProvider, TimeField} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AddIcon from '@mui/icons-material/Add';
import {arrayRange} from "@/utils/array";
import ListItemText from "@mui/material/ListItemText";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import List from "@mui/material/List";
import {TABLE_COLUMNS} from "@/app/defaultTableColumns";
import cytoscape from "cytoscape";
import {GraphManager} from "@/hooks/useGraphDataManager";


type Props = {
    graphManager: GraphManager,
    cytoscapeManager: CytoscapeManager,
    hideLabels: boolean
    setHideLabels: Dispatch<SetStateAction<boolean>>
};

export function DashboardHeader(props: Props) {
    const [isLoadDataPopupOpen, setLoadDataPopupOpen] = useState(false);
    const [openSettingsPopup, setOpenSettingsPopup] = useState(false);
    const timeZoneMenuItems= useMemo(() => arrayRange(0, 23, 1).map(v => <MenuItem key={v} value={v}>UTC +{String(v).padStart(2,'0')}</MenuItem>), []);

    return (
        <div className={styles.DashboardHeader}>
            <Stack direction="row" alignItems='center' justifyContent="space-between" spacing={1} className={styles.headerStack}>
                <img src='/logo.svg' className={styles.logo}></img>
                <Stack direction="row" spacing={0}>
                    <Button size='small' disableElevation className={styles.headerButton} startIcon={<SettingsIcon/>} onClick={()=>{setOpenSettingsPopup(true)}}>
                        Settings
                    </Button>
                    <Button size={'small'} disabled={true} className={styles.headerButton} onClick={() => {}}>
                        <AddIcon/> Add data
                    </Button>
                    <Button  size={'small'} className={styles.headerButton} onClick={() => setLoadDataPopupOpen(true)}>
                        <DownloadIcon/> Load data
                    </Button>
                    <LoadDataPopup
                        graphManager={props.graphManager}
                        isOpen={isLoadDataPopupOpen}
                        setOpen={setLoadDataPopupOpen}></LoadDataPopup>
                </Stack>
            </Stack>
            <Dialog
                open={openSettingsPopup}
                onClose={() => setOpenSettingsPopup(false)}
            >
                <DialogTitle>
                    Settings
                </DialogTitle>
                <DialogContent>
                    <Stack gap={3}>
                        <Stack>
                            Timezone: <Select size="small"
                                              onChange={()=>{}}
                                              disabled={true}
                                              value={0}
                                              inputProps={{ size:'small' }}
                        >
                            {...timeZoneMenuItems}
                        </Select>
                        </Stack>
                        <Stack>
                            Currency: <Select size="small"
                                              disabled={true}
                                              onChange={()=>{}}
                                              value={'USD'}
                                              inputProps={{ size:'small' }}
                        >
                            <MenuItem value={'USD'}>USD</MenuItem>
                            <MenuItem value={'EUR'}>EUR</MenuItem>
                        </Select>
                        </Stack>
                        <Stack>
                            Adjust currency for inflation: <Select size="small"
                                                                   disabled={true}
                                                                   onChange={()=>{}}
                                                                   value={'No'}
                                                                   inputProps={{ size:'small' }}
                        >
                            <MenuItem value={'Yes'}>Yes</MenuItem>
                            <MenuItem value={'No'}>No</MenuItem>
                        </Select>
                        </Stack>
                        <Stack>
                            Hide graph labels <Select size="small"
                                              onChange={e => props.setHideLabels(e.target.value == 'Yes')}
                                              value={props.hideLabels ? 'Yes' : 'No'}
                                              inputProps={{ size:'small' }}
                        >
                            <MenuItem value={'Yes'}>Yes</MenuItem>
                            <MenuItem value={'No'}>No</MenuItem>
                        </Select>
                        </Stack>
                        <Stack>
                            {/*TODO: turning feature off and on breaks graphs*/}
                            Group by country: <Select size="small"
                                                      onChange={(e)=>{props.cytoscapeManager.setGroupByCountry(e.target.value == 'Yes')}}
                                                      value={props.cytoscapeManager.groupByCountry ? 'Yes' : 'No'}
                                                      inputProps={{ size:'small' }}
                        >
                            <MenuItem value={'Yes'}>Yes</MenuItem>
                            <MenuItem value={'No'}>No</MenuItem>
                        </Select>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSettingsPopup(false)}>
                        Save
                    </Button>
                    <Button onClick={() => setOpenSettingsPopup(false)} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}
