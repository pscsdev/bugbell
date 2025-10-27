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

type Repo = {
  id: number;
  name: string;
  language?: string;
  issues?: { number: number; title: string }[];
};

export default function DashboardTable({ repos = [] }: { repos?: any[] }) {
  const starredRepos = repos;

  const allIssues = starredRepos.flatMap((repo) =>
    repo.issues.map((issue: any) => ({
      ...issue,
      repoName: repo.name,
      language: repo.language,
    }))
  );

  return (
    <main>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Repo</TableHead>
            <TableHead>Language</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allIssues.map((item) => (
            <TableRow key={item.number}>
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.repoName}</TableCell>
              <TableCell>{item.language}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          {/* <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow> */}
        </TableFooter>
      </Table>
    </main>
  );
}
