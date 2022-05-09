import React from 'react';
import {
    createTable,
    getCoreRowModelSync,
    getSortedRowModelSync,
    SortingState,
    useTableInstance,
  } from '@tanstack/react-table'

type Bounty = {
    project: string,
    issue: string,
    issueLink: string,
    bountyAmount: string,
    postedDate: string
};

const table = createTable().setRowType<Bounty>();

const defaultData: Bounty[] = [
    {
        project: 'DAppWork',
        issue: 'Add github link to bounty titles',
        issueLink: 'https://github.com/',
        bountyAmount: '.005 WETH',
        postedDate: '2022-05-05'
    },
    {
        project: 'Polygon',
        issue: 'Reach a billion users',
        issueLink: 'https://github.com/',
        bountyAmount: '.006 WETH',
        postedDate: '2022-05-06'
    },
]

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
    const [data] = React.useState(() => [...defaultData]);
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
        <div>
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
        </div>
      )
}

export default OpenBounties;
