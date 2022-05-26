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
import { BOUNTY_FACTORY_ABI, BOUNTY_FACTORY_ADDRESS } from '../abi';
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
        contract.functions.bfViewBountyArrayLength()
            .then(numBounties => {
                const result: Array<Bounty> = [];
                for (let i = 0; i < numBounties; i++) {
                    contract.functions.bfViewBounty(i)
                        .then(bountyTuple => {
                            console.log(bountyTuple);
                            if (bountyTuple[4] !== OPEN_STATUS) {
                                return;
                            }

                            const bounty: Bounty = {
                                project: "Dappwork", // TODO: parse out repo name
                                issue: bountyTuple[1],
                                issueLink: bountyTuple[2],
                                bountyAmount: formatEther(bountyTuple[3]) + " Ξ",
                                postedDate: bountyTuple[5]
                            };
                            result.push(bounty);
                        });
                }

                setBounties(result);
            })
    }, [connector, provider]);

    const [data] = React.useState(() => [...bounties]);
    const [columns] = React.useState<typeof defaultColumns>(() => [
        ...defaultColumns,
    ]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const instance = useTableInstance(table, {
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModelSync(),
        getSortedRowModel: getSortedRowModelSync(),
    });

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

export default OpenBounties;
