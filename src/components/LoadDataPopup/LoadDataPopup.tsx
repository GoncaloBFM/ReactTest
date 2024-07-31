import React, {useRef, useState} from 'react';
import {TextField, Stack, Modal, Box, Button, TextFieldProps} from "@mui/material";
import styles from './LoadDataPopup.module.scss';
import {AgGridReact} from "ag-grid-react";

import {useLoadDataPopupSearch} from '@/hooks/useLoadDataPopupSearch';
import {LoadingSpinner} from "@/components/LoadingSpinner/LoadingSpinner";


type Props = {
  onClose: () => void,
  isOpen:boolean
};

export function LoadDataPopup(props: Props) {

  const accountIdInputRef = useRef<HTMLInputElement>(null)
  const {isLoading, tableData, getLoadDataPopupSearchResult} = useLoadDataPopupSearch()
  return (
      <Modal
          open={props.isOpen}
          onClose={props.onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <Box className={styles.LoadDataPopup}>
          {isLoading && <LoadingSpinner />}
          <Stack direction="row" spacing={2}>
            <TextField id="outlined-basic" label="Account id" inputRef={accountIdInputRef} variant="outlined"/>
            <Button variant="outlined" onClick={() => accountIdInputRef && getLoadDataPopupSearchResult(accountIdInputRef.current.value)}>Search</Button>
          </Stack>

          <div className={`ag-theme-quartz ${styles.table}`}>
            <AgGridReact
                rowData={tableData.rowData}
                columnDefs={tableData.columnDefinitions}
            />
          </div>
        </Box>
      </Modal>
  )
}
