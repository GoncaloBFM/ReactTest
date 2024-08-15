import React, {useRef, useState} from 'react';
import {TextField, Stack, Modal, Box, Button, TextFieldProps} from "@mui/material";
import styles from './LoadDataPopup.module.scss';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';


import {useLoadDataPopupSearch} from '@/hooks/useLoadDataPopupSearch';
import {LoadingSpinner} from "@/components/LoadingSpinner/LoadingSpinner";

type Props = {
    isOpen:boolean,
    setOpen: (open: boolean) => void,
    onSubmit: (nodesIds: Array<string>) => Promise<void>
};

export function LoadDataPopup(props: Props) {
    const [personName, setPersonName] = useState<string>('')
    const [dataSelected, setDataSelected] = useState<Array<string>>(new Array<string>)
    const [tableData, setTableData] = useState(new Array<{}>());
    const {isLoading, doLoadDataPopupSearch} = useLoadDataPopupSearch(setTableData)

    const closePopup = () => {
        props.setOpen(false);
        setPersonName('')
        setDataSelected(new Array<string>)
        setTableData(new Array<string>)
    }

    return (
        <Modal
            open={props.isOpen}
            onClose={closePopup}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={styles.LoadDataPopup}>
                {isLoading && <LoadingSpinner/>}
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={2}>
                        <TextField id="outlined-basic" label="Person name" onChange={e => setPersonName(e.target.value)} variant="outlined"/>
                        <Button variant="outlined" onClick={()=>{personName && !isLoading && doLoadDataPopupSearch(personName)}}>Search</Button>
                        <Button variant="outlined"> Advanced Search</Button>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => {props.onSubmit(dataSelected); closePopup();}}>Add to graph</Button>
                    </Stack>
                </Stack>

                <div className={styles.table}>
                    <DataGrid
                        rows={tableData}
                        columns={
                        ['id','name','country','address','birthDate','type'].map(
                            (header: string)=> {return {field: header, headerName: header, flex: 1}})}
                        onRowSelectionModelChange={(ids) => {
                            setDataSelected(ids.map(x => x.toString()))
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0},
                            },
                        }}
                        checkboxSelection
                    />
                </div>
            </Box>
        </Modal>
    )
}
