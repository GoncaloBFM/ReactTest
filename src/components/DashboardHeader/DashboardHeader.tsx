import React, {useMemo, useState} from 'react';
import {
    AppBar,
    Button, Checkbox,
    Divider,
    FormControl,
    FormControlLabel, InputLabel, Menu,
    MenuItem, OutlinedInput,
    Select, SelectChangeEvent,
    Stack,
    Switch,
    Toolbar
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


type Props = {
    onSubmitLoadDataPopup: (nodeIds: Array<string>) => Promise<void>
    cytoscapeManager: CytoscapeManager,
};

export function DashboardHeader(props: Props) {
    const [isLoadDataPopupOpen, setLoadDataPopupOpen] = useState(false);
    const timeZoneMenuItems= useMemo(() => arrayRange(0, 23, 1).map(v => <MenuItem key={v} value={v}>Convert to UTC +{String(v).padStart(2,'0')}</MenuItem>), []);

    const [personName, setPersonName] = React.useState<string[]>([]);

    const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


    return (
        <div className={styles.DashboardHeader}>
            <Stack direction="row" alignItems='center' justifyContent="space-between" spacing={1} className={styles.headerStack}>
                <img src='/logo.svg' className={styles.logo}></img>
                <Stack direction="row" spacing={0}>
                {/*    <FormControlLabel control={<Switch />} label="Adjust for inflation" />*/}
                {/*    <Menu*/}
                {/*        id="basic-menu"*/}
                {/*        anchorEl={anchorEl}*/}
                {/*        open={open}*/}
                {/*        onClose={handleClose}*/}
                {/*        color={''}*/}
                {/*    >*/}
                {/*        {names.map((name) => (*/}
                {/*            <MenuItem dense={true} key={name} value={name}>*/}
                {/*                <Checkbox checked={personName.includes(name)} />*/}
                {/*                <ListItemText primary={name} />*/}
                {/*            </MenuItem>*/}
                {/*        ))}*/}
                {/*        <Divider orientation="vertical" flexItem />*/}
                {/*    </Menu>*/}
                {/*    <Select size="small"*/}
                {/*            onChange={()=>{}}*/}
                {/*            value={'EUR'}*/}
                {/*            inputProps={{ size:'small' }}*/}
                {/*    >*/}
                {/*        <MenuItem value={'EUR'}>Convert to EUR</MenuItem>*/}
                {/*        <MenuItem value={'USD'}>Convert to USD</MenuItem>*/}
                {/*    </Select>*/}
                {/*    <Divider orientation="vertical" flexItem />*/}
                {/*    <Select size="small"*/}
                {/*            onChange={()=>{}}*/}
                {/*            value={0}*/}
                {/*            inputProps={{ size:'small' }}*/}
                {/*    >*/}
                {/*        {...timeZoneMenuItems}*/}
                {/*    </Select>*/}
                {/*    <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
                {/*        <DateTimePicker  */}
                {/*            slotProps={{ textField: { size: 'small', placeholder:"Start date" } }} */}
                {/*            label=""*/}
                {/*            viewRenderers={{*/}
                {/*                hours: renderTimeViewClock,*/}
                {/*                minutes: renderTimeViewClock,*/}
                {/*                seconds: renderTimeViewClock,*/}
                {/*            }}*/}
                {/*        />*/}
                {/*        <DateTimePicker*/}
                {/*            slotProps={{ textField: { size: 'small', placeholder:"End date" } }} */}
                {/*            label="" */}
                {/*            className={styles.datePicker}*/}
                {/*            viewRenderers={{*/}
                {/*                hours: renderTimeViewClock,*/}
                {/*                minutes: renderTimeViewClock,*/}
                {/*                seconds: renderTimeViewClock,*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </LocalizationProvider>*/}
                {/*    <Divider orientation="vertical" flexItem />*/}
                    <Button disabled size='small' disableElevation className={styles.headerButton} startIcon={<FilterAltIcon/>} onClick={handleClick}>
                        Filters
                    </Button>
                    <Button disabled size='small' disableElevation className={styles.headerButton} startIcon={<SettingsIcon/>} onClick={handleClick}>
                        Settings
                    </Button>
                    <Button disabled size={'small'} className={styles.headerButton} onClick={() => {}}>
                        <AddIcon/> Add data
                    </Button>
                    <Button  size={'small'} className={styles.headerButton} onClick={() => setLoadDataPopupOpen(true)}>
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
