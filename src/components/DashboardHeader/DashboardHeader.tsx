import React from 'react';
import { Button, Stack } from "@mui/material";
import styles from './DashboardHeader.module.scss'
import { LoadDataPopup } from "@/components/LoadDataPopup/LoadDataPopup";
import { useGraphVisualization } from '../GraphVisualization/useGraphVisualizationControl';

type Props = {
  onSubmitLoadDataPopup: (nodeIds: Array<string>) => Promise<void>
};
export function DashboardHeader(props: Props) {

  const [isLoadDataPopupOpen, setLoadDataPopupOpen] = React.useState(false);
  const { cy } = useGraphVisualization();

  return (
    <Stack direction="row" justifyContent="space-between" className={styles.DashboardHeader}>
      <span className={styles.logo}> AMLVis </span>
      <Stack direction="row" spacing={2} justifyContent="">
        <Button variant="outlined" onClick={() => {
          const layout = cy?.layout
          cy?.layout({ name: 'cose-bilkent' }).run()
          console.log('<DashboardHeader /> rerun', { layout, props })
        }}>
          Rerun layout
        </Button>
        <Button variant="outlined" onClick={() => {
          cy?.fit()
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
