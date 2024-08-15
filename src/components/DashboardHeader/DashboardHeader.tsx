import React from 'react';
import { Button, Stack } from "@mui/material";
import styles from './DashboardHeader.module.scss'
import { LoadDataPopup } from "@/components/LoadDataPopup/LoadDataPopup";
import { CytoscapeManager } from '@/hooks/useCytoscapeManager';

type Props = {
  onSubmitLoadDataPopup: (nodeIds: Array<string>) => Promise<void>
  cytoscapeManager: CytoscapeManager,
};
export function DashboardHeader(props: Props) {

  const [isLoadDataPopupOpen, setLoadDataPopupOpen] = React.useState(false);

  return (
    <Stack direction="row" justifyContent="space-between" className={styles.DashboardHeader}>
      <span className={styles.logo}> AMLVis </span>
      <Stack direction="row" spacing={2} justifyContent="">
        <Button variant="outlined" onClick={() => {
          const layout = props.cytoscapeManager.layout
          props.cytoscapeManager.cy?.layout(layout).run()
          console.log('<DashboardHeader /> rerun', { layout, props })
        }}>
          Rerun layout
        </Button>
        <Button variant="outlined" onClick={() => {
          props.cytoscapeManager.cy?.fit()
        }}>Center on Graph</Button>
        <Button variant="outlined" onClick={() => setLoadDataPopupOpen(true)}>Load data</Button>
        <LoadDataPopup
          onSubmit={props.onSubmitLoadDataPopup}
          isOpen={isLoadDataPopupOpen}
          setOpen={setLoadDataPopupOpen}></LoadDataPopup>
      </Stack>
    </Stack>
  );
}
