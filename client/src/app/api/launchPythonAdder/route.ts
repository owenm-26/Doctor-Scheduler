import { exec } from "child_process";
import { NextResponse } from "next/server";

export default async function GET() {
  exec(
    "python3 /Users/owenmariani/Desktop/Streching-Pal/backend/posegui2.py",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return NextResponse.json(
          { error: "Failed to execute" },
          { status: 500 }
        );
      }
      if (stderr) {
        console.error(`Script error output: ${stderr}`);
        return NextResponse.json({ error: "Script error" }, { status: 500 });
      }
      // Success, send back the output
      console.log(`Script output: ${stdout}`);
      return NextResponse.json({ message: stdout }, { status: 200 });
    }
  );
}
