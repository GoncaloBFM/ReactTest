import React from 'react';
import { PlottingData } from '@/hooks/usePlottingData';
import CytoscapeComponent from 'react-cytoscapejs';
import styles from './GraphVisualization.module.scss';


type Props = {
    data: PlottingData,
    filterData: () => void,
};

export function GraphVisualization(props: Props) {
    const elements = [
       { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
       { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
       { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    ];

    return <CytoscapeComponent elements={elements} className={styles.GraphVisualization}/>;
}
