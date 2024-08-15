import {GraphEdge} from "@/types/GraphEdge";
import {SingleNode} from "@/types/SingleNode";
import {CompoundNode} from "@/types/CompoundNode";
import {CompoundEdge} from "@/types/CompoundEdge";
import {SingleEdge} from "@/types/SingleEdge";
import {GraphNode} from "@/types/GraphNode";

export class Graph {
    nodes: Map<string, SingleNode>;
    edges: Map<string, GraphEdge>;
    compoundNodes: Map<string, CompoundNode>;
    compoundEdges: Map<string, CompoundEdge>;
    edgesCountToCompound: number;
    nodesCountToCompound: number;

    constructor(edgesCountToCompound: number, nodesCountToCompound: number) {
        this.edgesCountToCompound = edgesCountToCompound;
        this.nodesCountToCompound = nodesCountToCompound;

        this.edges = new Map()
        this.nodes = new Map()

        this.compoundNodes = new Map()
        this.compoundEdges = new Map()
    }

    createCompoundNode(nodes: Array<GraphNode>){
        const nodesToCompound = nodes.map(node => {
            if (node instanceof CompoundNode) {
                return this.removeCompoundNode(node)
            }
            return [node as SingleNode]
        }).flat(1)

        const compoundNode = new CompoundNode(nodesToCompound)
        this.compoundNodes.set(compoundNode.id, compoundNode)
        nodesToCompound.map(node => node.compound = compoundNode)
        return compoundNode
    }

    removeCompoundNode(compoundNode: CompoundNode){
        this.compoundNodes.delete(compoundNode.id)
        compoundNode.nodes.forEach(node => node.compound = undefined)
        return Array.from(compoundNode.nodes.values())
    }

    createCompoundEdge(edges: Array<GraphEdge>){
        const edgesToCompound = edges.map(edge => {
            if (edge instanceof CompoundEdge) {
                return this.removeCompoundEdge(edge)
            }
            return [edge as SingleEdge]
        }).flat(1)

        const compoundEdge = new CompoundEdge(edgesToCompound)
        this.compoundEdges.set(compoundEdge.id, compoundEdge)
        edgesToCompound.map(edge => edge.compound = compoundEdge)
        return compoundEdge
    }

    removeCompoundEdge(compoundEdge: CompoundEdge){
        this.compoundEdges.delete(compoundEdge.id)
        compoundEdge.edges.forEach(edge => edge.compound = undefined)
        return Array.from(compoundEdge.edges.values())
    }

    addSingleEdges(newEdges: Array<SingleEdge>){
        newEdges.forEach(newEdge => {
            this.edges.set(newEdge.id, newEdge)

            const looseEdges = Array.from(this.edges.values())
                .filter(edge => (edge.origin == newEdge.origin) && (edge.target == newEdge.target))

            if (looseEdges.length >= this.edgesCountToCompound) {
                this.createCompoundEdge(looseEdges.concat(newEdge))
            }
        })
    }

    addSingleNodes(newNodes: Array<SingleNode>){
        newNodes.forEach(node => this.nodes.set(node.id, node))
    }

    removeSingleEdges(oldEdges: Array<SingleEdge>){
        oldEdges.forEach(edge => {
            this.edges.delete(edge.id)
            if (edge.compound) {
                edge.compound.removeEdges([edge])
            }
        })
    }

    removeSingleNodes(oldNodes: Array<SingleNode>){
        oldNodes.map(node => {
            this.nodes.delete(node.id)
            if (node.compound) {
                node.compound.removeNodes([node])
            }
            node.expanded = false
        })
    }
}