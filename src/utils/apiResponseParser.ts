import {useCallback} from "react";
import {GraphEdge} from "@/types/GraphEdge";
import {EdgeType} from "@/types/EdgeType";
import {TransactionEdge} from "@/types/TransactionEdge";
import {ConnectionEdge} from "@/types/ConnectionEdge";
import {GraphNode} from "@/types/GraphNode";
import {NodeType} from "@/types/NodeType";
import {PersonNode} from "@/types/PersonNode";
import {AccountNode} from "@/types/AccountNode";
import {CompanyNode} from "@/types/CompanyNode";

export const parseRawEdge = (rawEdge: {[key:string]: string}): GraphEdge => {
        if (rawEdge['type'] == EdgeType.transaction) {
            return new TransactionEdge(
                rawEdge['source'],
                rawEdge['target'],
                rawEdge['id'],
                parseFloat(rawEdge['amountPaid']),
                rawEdge['currency'],
                rawEdge['transactionType'],
                new Date(parseFloat(rawEdge['timestamp']) * 1000),
                {},
            )
        }

        if (rawEdge['type'] == EdgeType.connection)
            return new ConnectionEdge(
                rawEdge['source'],
                rawEdge['target'],
                rawEdge['id'],
                rawEdge['name'],
                {})

        throw new Error(`Unknown edge type ${rawEdge['type']}`)
    }

 export const parseRawNode = (rawNode: {[key:string]: string}): GraphNode => {
        if (rawNode['type'] == NodeType.person)
            return new PersonNode(
                rawNode['id'],
                rawNode['name'],
                rawNode['nationality'],
                rawNode['address'],
                {})

        if (rawNode['type'] == NodeType.account)
            return new AccountNode(
                rawNode['id'],
                rawNode['iban'],
                rawNode['nationality'],
                {})

        if (rawNode['type'] == NodeType.company)
            return new CompanyNode(
                rawNode['id'],
                rawNode['name'],
                rawNode['nationality'],
                rawNode['address'],
                {})

        throw new Error(`Unknown node type ${rawNode['type']}`)
    }

