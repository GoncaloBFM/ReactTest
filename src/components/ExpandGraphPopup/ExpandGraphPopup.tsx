import React, {useRef, useState} from 'react';
import {TextField, Stack, Modal, Box, Button, TextFieldProps} from "@mui/material";
import styles from './LoadDataPopup.module.scss';
import {DataGrid, GridColDef, useGridApiRef} from '@mui/x-data-grid';


import {useLoadDataPopupSearch} from '@/hooks/useLoadDataPopupSearch';
import {LoadingSpinner} from "@/components/LoadingSpinner/LoadingSpinner";

type Props = {
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    onSubmit: (nodesIds: Array<string>) => Promise<void>
};

export function ExpandGraphPopup(props: Props) {
    const closePopup = () => {
    }

    return (
        <Modal
            open={props.isOpen}
            onClose={closePopup}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={styles.LoadDataPopup}>

            </Box>
        </Modal>
    )
}
