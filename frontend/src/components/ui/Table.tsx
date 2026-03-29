import { cn } from '../../lib/utils';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export function Table({ headers, children, className }: TableProps) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-3xl border border-white/5 bg-white/5", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/5">
            {headers.map((header) => (
              <th
                key={header}
                className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-silver/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={cn("hover:bg-white/5 transition-colors group", className)}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("px-8 py-5 text-sm text-brand-silver font-medium", className)}>
      {children}
    </td>
  );
}
