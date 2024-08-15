import React, { MutableRefObject, Ref, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
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
import { CytoscapeManager } from '@/hooks/useCytoscapeManager';

cytoscape.use(COSEBilkent);

type GraphData = {
  nodes: GraphNode[],
  edges: GraphEdge[],
}

type Props = {
  graphData: GraphData,
  onSelectElement: SetStateAction<any>,
  manager: CytoscapeManager
};

export function GraphVisualization(props: Props) {

  const cy = props.manager.cy;
  const onSelectElement = props.onSelectElement;

  useEffect(() => {
    console.log("<GraphVisualization /> useEffect() -- resetting cy handlers")
    const stale = cy;
    if (stale == null)
      return;

    const tapHandler = (e: any) => {
      if (e.target === stale) {
        onSelectElement(undefined);
      }
    };

    const clickHandler = (e: any) => {
      onSelectElement(e.target.data())
    };

    stale.on('tap', tapHandler);
    stale.on('click', 'node', clickHandler);

    // clean up
    () => {
      stale.off('tap', tapHandler);
      stale.off('click', 'node', clickHandler);
    }
  }, [cy, onSelectElement])


  const cytoscapeGraph = useMemo(() => [
    ...props.graphData.nodes.map(e => ({ data: { ...e.data, ...e } })),
    ...props.graphData.edges.map(e => ({ data: { ...e.data, ...e } })),
  ], [props.graphData]);

  console.log("<CytoscapeManager/>", { cytoscapeGraph });

  return <>
    <CytoscapeComponent
      elements={cytoscapeGraph}
      layout={props.manager.layout}
      className={styles.GraphVisualization}
      cy={(cy) => props.manager.setCy(cy)}
      zoom={2}
      stylesheet={stylesheet as any}
    />
  </>;

}
