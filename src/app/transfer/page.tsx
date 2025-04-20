// app/materials/page.tsx
async function getTransfers() {
  const res = await fetch(
    "http://127.0.0.1:8888/api/materials/M900/transfers",
    {
      cache: "no-store", // equivalent to SSR
    }
  );
  return res.json();
}

export default async function MaterialTransfersPage() {
  const transfers = await getTransfers();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Material M900 Transfers</h2>
      {transfers.length === 0 ? (
        <p>No transfers found.</p>
      ) : (
        transfers.map((transfer: any, idx: number) => (
          <div key={idx} className="border p-3 mb-2 rounded bg-white shadow">
            <p>
              <strong>From:</strong> {transfer.from.lat}, {transfer.from.lng}
            </p>
            <p>
              <strong>To:</strong> {transfer.to.lat}, {transfer.to.lng}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(transfer.timestamp * 1000).toLocaleString()}
            </p>
            <p>
              <strong>Tx Hash:</strong> <code>{transfer.txHash}</code>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
