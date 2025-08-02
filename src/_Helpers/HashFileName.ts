import { createHash } from "crypto";

export default async function HashFileName(fileName: string): Promise<string> {
    return createHash("sha256").update(fileName).digest("hex");
}