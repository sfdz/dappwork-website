import React, { useEffect } from 'react';
import {
    createTable,
    getCoreRowModelSync,
    getSortedRowModelSync,
    SortingState,
    useTableInstance,
  } from '@tanstack/react-table';
import { useWeb3React } from '@web3-react/core'
import { Link, useParams } from "react-router-dom";
import { BOUNTY_FACTORY_ABI } from '../abi';
import { Contract } from '@ethersproject/contracts';
import { formatEther } from '@ethersproject/units';

type Bounty = {
    project: string,
    issue: string,
    issueLink: string,
    bountyAmount: string,
    postedDate: string
};

const table = createTable().setRowType<Bounty>();

const OPEN_STATUS = 0;

const defaultColumns = [
    table.createGroup({
        header: 'Open Bounties',
        columns: [
            table.createDataColumn(row => row.project, {
                id: 'project',
                cell: info => info.value,
                header: () => <span>Project</span>,
            }),
            table.createDataColumn(row => row.issue, {
                id: 'issue',
                cell: ({ row }) => <a href={row.original?.issueLink}>{row.original?.issue}</a>,
                header: () => <span>Issue</span>,
            }),
            table.createDataColumn(row => row.bountyAmount, {
                id: 'bountyAmount',
                cell: info => info.value,
                header: () => <span>Bounty Amount</span>,
            }),
            table.createDataColumn(row => row.postedDate, {
                id: 'postedDate',
                cell: info => info.value,
                header: () => <span>Posted Date</span>,
            }),
        ]
    })
]

function OpenBounties() {
    const context = useWeb3React();
    const { connector, provider } = context;

    const [bounties, setBounties] = React.useState<Bounty[]>([]);

    const { factoryAddress } = useParams();

    useEffect(() => {
        if (factoryAddress === undefined) {
            return;
        }

        connector.activate();
        const contract = new Contract(factoryAddress, BOUNTY_FACTORY_ABI, provider);
        const result: Array<Bounty> = [];
        let promiseChain = Promise.resolve();
        for (let i = 0; i < 1; i++) {
            promiseChain = promiseChain.then(() => {
                return contract.functions.bfViewBounty(i);
            }).then(bountyTuple => {
                if (bountyTuple[4] !== OPEN_STATUS) {
                    return;
                }

                const bounty: Bounty = {
                    project: parseRepoName(bountyTuple[2]),
                    issue: bountyTuple[1],
                    issueLink: bountyTuple[2],
                    bountyAmount: formatEther(bountyTuple[3]) + " Ξ",
                    postedDate: new Date(bountyTuple[5].mul(1000).toNumber()).toISOString(),
                };
                console.log(bounty);
                result.push(bounty);
            });
        }
        promiseChain.then(() => setBounties(result));
    }, [connector, provider, factoryAddress]);

    const [columns] = React.useState<typeof defaultColumns>(() => [
        ...defaultColumns,
    ]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const instance = useTableInstance(table, {
        data: bounties,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModelSync(),
        getSortedRowModel: getSortedRowModelSync(),
    });

    if (bounties.length === 0) {
        return (
            <>
                <Link to="/new-bounty">+ New Bounty</Link>
                <p>No open bounties found at this address 😔</p>
            </>
        );
    }

      return (
        <>
            {provider === undefined && <p>Web 3 Provider not found 😔</p>}
            <Link to="/new-bounty">+ New Bounty</Link>
            <table>
                <thead>
                {instance.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                            <div
                                {...{
                                    className: header.column.getCanSort()
                                        ? 'cursor-pointer select-none'
                                        : '',
                                    onClick: header.column.getToggleSortingHandler(),
                                }}
                            >
                                {header.renderHeader()}
                                {{
                                    asc: ' 🔼',
                                    desc: ' 🔽',
                                }[header.column.getIsSorted() as string] ?? null}
                            </div>
                        )}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {instance.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{cell.renderCell()}</td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
      )
}

const parseRepoName = (issueURL: String) => {
    const issueURLPattern = /^https:\/\/github.com\/[^-][^/]{0,38}\/([-_.A-Za-z0-9]{1,100})\/issues\/\d{1,10}\/?$/;
    const match = issueURL.match(issueURLPattern);
    if (match === null) {
        return "";
    }

    return match[1];
}

export default OpenBounties;
