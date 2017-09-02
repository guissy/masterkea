export default function buildRowKey(record: any, index: number) {
  return (record && record.id) || String(index);
}
