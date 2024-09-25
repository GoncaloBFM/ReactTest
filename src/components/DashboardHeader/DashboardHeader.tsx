import React from 'react';
import {Button, Divider, FormControl, MenuItem, Select, Stack} from "@mui/material";
import styles from './DashboardHeader.module.scss'
import { LoadDataPopup } from "@/components/LoadDataPopup/LoadDataPopup";
import { CytoscapeManager } from '@/hooks/useCytoscapeManager';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider, TimeField} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';


type Props = {
  onSubmitLoadDataPopup: (nodeIds: Array<string>) => Promise<void>
  cytoscapeManager: CytoscapeManager,
};
export function DashboardHeader(props: Props) {
  const [currencyBehavior, setCurrencyBehavior] = React.useState('filter');
  const [currency, setCurrency] = React.useState('USD');
  const [isLoadDataPopupOpen, setLoadDataPopupOpen] = React.useState(false);

  return (
      <Stack direction="row" justifyContent="space-between" className={styles.DashboardHeader} spacing={1}>
          <Stack direction="row" spacing={1}>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Select value={currencyBehavior} autoWidth={true} onChange={event => setCurrencyBehavior(event.target.value as string)}>
                  <MenuItem value={'filter'}>Filter by</MenuItem>
                  <MenuItem value={'convert'}>Convert to</MenuItem>
              </Select>
              <Select value={currency} autoWidth={true} onChange={event => setCurrency(event.target.value as string)}>
                  <MenuItem value={'USD'}>USD</MenuItem>
                  <MenuItem value={'EUR'}>EUR</MenuItem>
                  <MenuItem value={'GBP'}>GBP</MenuItem>
                  <MenuItem value={'CAD'}>CAD</MenuItem>
                  <MenuItem value={'AUD'}>AUD</MenuItem>
                  <MenuItem value={'JPY'}>JPY</MenuItem>
              </Select>
              {/*TODO: add timezone controls*/}
          </Stack>
        <Stack direction="row" spacing={1}>
            <Button variant="outlined" size={'small'} >
                <FilterAltIcon/> Advanced filters
            </Button>
            <Button variant="outlined" size={'small'} >
                <FilterAltOffIcon/> Clear filters
            </Button>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Button variant="outlined" size={'small'} onClick={() => {
                props.cytoscapeManager.reRunLayout()
            }}>
                <RestartAltIcon/> Rerun layout
            </Button>
            <Button variant="outlined" size={'small'} onClick={() => {
                props.cytoscapeManager.cy?.fit()
            }}>
                <FilterCenterFocusIcon/> Center on Graph
            </Button>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Button variant="outlined" size={'small'} onClick={() => setLoadDataPopupOpen(true)}>
                <DownloadIcon/> Load data
            </Button>
            <LoadDataPopup
                onSubmit={props.onSubmitLoadDataPopup}
                isOpen={isLoadDataPopupOpen}
                setOpen={setLoadDataPopupOpen}></LoadDataPopup>
        </Stack>
    </Stack>
  );
}
