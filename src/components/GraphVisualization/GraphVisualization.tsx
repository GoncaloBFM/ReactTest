import React, { MutableRefObject, Ref, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import styles from './GraphVisualization.module.scss';
import { SERVER_URL } from "@/app/definitions";
import { node } from "prop-types";
import cytoscape, { Core } from 'cytoscape';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import cxtmenu from 'cytoscape-cxtmenu';
import { SingleNode } from "@/types/SingleNode";
import { Graph } from "@/types/Graph";
import { GraphEdge } from "@/types/GraphEdge";
import { GraphNode } from '@/types/GraphNode';
import { stylesheet } from './stylesheet';
import { selectGraphView, setSelectedNodes } from '@/lib/features/graphView/graphViewSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { GraphVisualizationContext } from './GraphVisualizationProvider';
import { loadData } from '@/lib/features/graphData/graphDataSlice';

cytoscape.use(COSEBilkent);

const Layouts = {
  COSE: { name: 'cose-bilkent' },
};

type Props = {};

export function GraphVisualization(props: Props) {
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const ctx = useContext(GraphVisualizationContext);

  const graphView = useAppSelector(state => selectGraphView(state));
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadData());
  }, [dispatch]);

  // update context
  useEffect(() => {
    if (cy != null) {
      ctx.setCy(cy);
    }
  }, [cy, ctx]);

  useEffect(() => {
    const stale = cy;

    const tapHandler = (e: any) => {
      if (e.target === stale) {
        dispatch(setSelectedNodes([]));
      }
    };

    const clickHandler = (e: any) => {
      dispatch(setSelectedNodes([e.target.data()?.id]));
    };

    stale?.on('tap', tapHandler);
    stale?.on('click', 'node', clickHandler);

    // clean up
    () => {
      stale?.off('tap', tapHandler);
      stale?.off('click', 'node', clickHandler);
    }
  }, [cy, dispatch])


  const cytoscapeGraph = useMemo(() => [
    ...graphView.nodes.map(({ id, data }) => ({ data: { ...data, id } })),
    ...graphView.edges.map(({ id, source, target, data }) => ({
      data: {
        ...data,
        id,
        source,
        target,
      }
    })),
  ], [graphView]);

  console.log("<GraphVisualization />", { cytoscapeGraph });

  return <>
    <CytoscapeComponent
      elements={cytoscapeGraph}
      layout={Layouts.COSE}
      className={styles.GraphVisualization}
      cy={(cy) => setCy(cy)}
      zoom={2}
      stylesheet={stylesheet as any}
    />
  </>;

}
