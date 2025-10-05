import Head from "next/head";
import fs from "fs";
import path from "path";

export async function getServerSideProps({ params }) {
  const filePath = path.join(process.cwd(), "data", `${params.id}.txt`);
  const data = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : null;

  return { props: { data, id: params.id } };
}

export default function RawPage({ data, id }) {
  if (!data)
    return (
      <div
        style={{
          color: "#f00",
          background: "#000",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        <h1>Data dengan ID "{id}" tidak ditemukan.</h1>
      </div>
    );

  const decoded = decodeURIComponent(escape(atob(data)));

  return (
    <>
      <Head>
        <title>{id} | Raw Viewer</title>
        <meta name="description" content={`Raw HTML file ID ${id}`} />
      </Head>

      <div
        dangerouslySetInnerHTML={{ __html: decoded }}
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#0f0",
          fontFamily: "monospace",
          padding: "1rem",
        }}
      />
    </>
  );
}
