import type { DataLine } from './table-row';
import TableRow from './table-row';

export default function Table({ data }: { data: DataLine[] }) {
  return (
    <div>
      {data &&
        data.length &&
        data.map((dataItem: DataLine) => {
          return (
            <TableRow
              key={dataItem.id}
              id={dataItem.id}
              mainMedicalDisorder={dataItem.mainMedicalDisorder}
              email={dataItem.email}
              status={dataItem.status}
            />
          );
        })}
    </div>
  );
}
