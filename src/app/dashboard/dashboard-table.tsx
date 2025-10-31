import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import debounce from "debounce";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,  
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconBrandGit, IconExternalLink, IconRefresh, IconReload } from "@tabler/icons-react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, GitBranch, MoreHorizontal } from "lucide-react";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type IssueRow = {
  number: number;
  title: string;
  repoName: string;
  language?: string;
  state: string;
  created: string;
  url: string;
};

export const columns: ColumnDef<IssueRow>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("number")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Issues",
    cell: ({ row }) => {
      const url = row.original.url as string;
      const isIssue = url.includes("issues");
      return (
        <div>
          <div className="flex items-center gap-2">
            <span className="capitalize truncate max-w-[500px]">{row.getValue("title")}</span>
            {!isIssue && (
              <div className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md">
                PR
              </div>
            )}
          </div>
          <div className="flex items-center">
            <IconBrandGit size={16}/>
            <span className="pl-1">{row.original.repoName}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={
          row.getValue("state") == "open" ? "bg-green-600" : "bg-red-600"
        }
      >
        {row.getValue("state")}
      </Badge>
    ),
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => (
      <Badge className="capitalize text-white" variant={"outline"}>
        {row.getValue("language")}
      </Badge>
    ),
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => (
      <div className="capitalize text-white">
        {timeAgo(row.getValue("created"))}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => (
      <a
        href={row.original.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-blue-600"
      >
        <IconExternalLink size={16} />
      </a>
    ),
  },
];

function timeAgo(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export default function DashboardTable({ repos = [] }: { repos?: any[] }) {
  const starredRepos = repos;

  const data: IssueRow[] = repos.flatMap((repo: any) =>
    (repo.issues || []).map((issue: any) => ({
      number: issue.number,
      title: issue.title,
      repoName: repo.name,
      language: repo.language,
      state: issue.state,
      created: issue.createdAt,
      url: issue.url,
    }))
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize:10,
      }
    }
  });
  
  const [titleFilterInput, setTitleFilterInput] = React.useState<string>(() => {
    const col = table.getColumn("title");
    const v = col?.getFilterValue();
    return (typeof v === "string" && v) || "";
  });

  //  React.useEffect(() => {
  //   const handler = setTimeout(() => {
  //     const col = table.getColumn("title");
  //     if (col && typeof col.setFilterValue === "function") {
  //       col.setFilterValue(titleFilterInput || undefined);
  //     }
  //   }, 200);

  //   return () => clearTimeout(handler);
  // }, [titleFilterInput, table]);

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  
   const paginationItems = React.useMemo(() => {
    const items = [];

    items.push(
      <PaginationItem key={0}>
        <PaginationLink
          onClick={() => table.setPageIndex(0)}
          isActive={currentPage === 0}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (currentPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = Math.max(1, currentPage - 1); i <= Math.min(pageCount - 2, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => table.setPageIndex(i)}
            isActive={currentPage === i}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < pageCount - 3) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (pageCount > 1) {
      items.push(
        <PaginationItem key={pageCount - 1}>
          <PaginationLink 
            onClick={() => table.setPageIndex(pageCount - 1)}
            isActive={currentPage === pageCount - 1}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  }, [currentPage, pageCount, table]);

  return (
    <div className="w-full">
      {/* <div className="flex justify-end">
        <IconReload />
      </div> */}
      <div className="pt-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* {pageCount > 1 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {currentPage * 10 + 1} to {Math.min((currentPage + 1) * 10, data.length)} of {data.length} results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => table.previousPage()}
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {paginationItems}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => table.nextPage()}
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )} */}
    </div>
  );
}