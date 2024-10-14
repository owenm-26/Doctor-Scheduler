import { exec } from "child_process";
import { NextResponse } from "next/server";

export const GET = async () => {
  return new Promise((resolve) => {
    exec(
      "python3 /Users/owenmariani/Desktop/Streching-Pal/backend/posegui2.py",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error.message}`);
          resolve(
            NextResponse.json({ error: "Failed to execute" }, { status: 500 })
          );
          return;
        }
        if (stderr) {
          console.error(`Script error output: ${stderr}`);
          resolve(
            NextResponse.json({ error: "Script error" }, { status: 500 })
          );
          return;
        }
        // Success, send back the output
        console.log(`Script output: ${stdout}`);
        resolve(NextResponse.json({ message: stdout }, { status: 200 }));
      }
    );
  });
};
