import React, { useState, useEffect } from 'react';
import { _GET } from '../../utils/auth_api';
import { User, MoreVertical } from 'lucide-react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { Button } from '../ui/button';
import GoogleContentDrawer from '../Drawer/EditDrawer/GoogleContentDrawer';

interface GoogleAccount {
    id: number;
    userId: number;
    type: string;
    groupId: number;
    email: string;
    password: string;
    recoveryEmail: string;
    twoFactor: string;
    phone: string;
    displayName: string;
    dateOfBirth: string;
    country: string;
    language: string;
    agent: string;
    proxy: string;
    status: string;
    notes: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

interface GoogleContentProps {
    id: number | null;
}

const GoogleContent: React.FC<GoogleContentProps> = ({ id }) => {
    const [data, setData] = useState<GoogleAccount[]>([]);
    const [selectedRow, setSelectedRow] = useState<GoogleAccount | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const endpoint = id ? `/googles/group/${id}` : '/googles';
                const response = await _GET(endpoint);
                setData(response);
            } catch (err) {
                console.error('Error fetching google accounts:', err);
                setError('Failed to fetch accounts');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredData = React.useMemo(() => {
        return data.filter(item => {
            const matchesSearch = (item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone?.includes(searchTerm) ||
                item.country?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
            const matchesCountry = filterCountry === 'all' || item.country === filterCountry;
            return matchesSearch && matchesCountry;
        });
    }, [searchTerm, filterCountry, data]);

    const uniqueCountries = React.useMemo(() => {
        return ['all', ...new Set(data.map(item => item.country).filter(Boolean))];
    }, [data]);

    const columnHelper = createColumnHelper<GoogleAccount>();

    const columns = [
        columnHelper.accessor('email', {
            header: 'Email',
            cell: info => info.getValue() || 'N/A',
        }),
        columnHelper.accessor('phone', {
            header: 'Phone',
            cell: info => info.getValue() || 'N/A',
        }),
        columnHelper.accessor('country', {
            header: 'Country',
            cell: info => info.getValue() || 'N/A',
        }),
        columnHelper.accessor('password', {
            header: 'Password',
            cell: info => info.getValue() ? '••••••••' : 'N/A',
        }),
        columnHelper.accessor('createdAt', {
            header: 'Created At',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.accessor('id', {
            header: 'Action',
            cell: (info) => (
                <button
                    onClick={() => {
                        setSelectedRow(info.row.original);
                        setIsDrawerOpen(true);
                    }}
                    className="p-2 hover:bg-blue-100 rounded-full"
                >
                    <MoreVertical className="h-4 w-4" />
                </button>
            ),
        }),
    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-4">
            {/* Search Bar & Navigation Filters */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-searchBar-background"
                    />
                    <select
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-searchBar-background"
                    >
                        {uniqueCountries.map(country => (
                            <option key={country} value={country}>
                                {country === 'all' ? 'All Countries' : country}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto rounded-sm shadow-md">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-table-headerBackground hover:bg-table-headerHover bg-opacity-20 text-table-header-foreground">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-6 py-3">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                className="bg-table-bodyBackground bg-opacity-30 border-b border-table-body-foreground hover:bg-table-bodyHover hover:bg-opacity-40 transition-colors"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-2 py-1 text-gray-400">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="border rounded-md disabled:opacity-50 hover:bg-gray-100"
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="border rounded-md disabled:opacity-50 hover:bg-gray-100"
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Drawer */}
            <GoogleContentDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                account={selectedRow}
            />
        </div>
    );
};

export default GoogleContent;