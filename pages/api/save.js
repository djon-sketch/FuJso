import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id } = req.query;
  const { data } = req.body;
  const dir = path.join(process.cwd(), "data");
  const filePath = path.join(dir, `${id}.txt`);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(filePath, data);

  res.status(200).json({ success: true });
}
