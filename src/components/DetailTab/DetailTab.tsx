import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button } from "@mui/material";
import { SingleNode } from "@/types/SingleNode";

type Props = {
  selectedElement: SingleNode | undefined
  expandNodeData: (node_id: string) => void
  removeNodeData: (node_ids: Array<string>) => void
};

export function DetailTab(props: Props) {
  const generateListElement = (element: { [key: string]: any }) => {
    const properties = Object.keys(element).sort()
    return properties.map((property: string) =>
      <ListItem key={property}>
        <ListItemText primary={`${property}: ${element[property]}`} />
      </ListItem>
    )
  }

  return (<>
    {
      props.selectedElement &&
      <>
        <Button variant="outlined" size={'small'} onClick={() => { props.selectedElement && props.expandNodeData(props.selectedElement.id) }}>Expand</Button>
        <Button variant="outlined" size={'small'}>Contract</Button>
        <Button variant="outlined" size={'small'} onClick={() => { props.selectedElement && props.removeNodeData([props.selectedElement.id]) }}>Remove</Button>
        <List>
          {generateListElement(props.selectedElement)}
        </List>
      </>
    }
  </>)
}
