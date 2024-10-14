import { exec } from "child_process";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const result = await new Promise((resolve, reject) => {
      exec(
        "python3 /Users/owenmariani/Desktop/Streching-Pal/backend/posegui2.py",
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            reject({ error: "Failed to execute" });
          } else if (stderr) {
            console.error(`Script error output: ${stderr}`);
            reject({ error: "Script error" });
          } else {
            // Success, resolve with the output
            console.log(`Script output: ${stdout}`);
            resolve(stdout);
          }
        }
      );
    });

    // Respond with the result of the Python script execution
    return NextResponse.json({ message: result }, { status: 200 });
  } catch (err) {
    // Handle errors and return an appropriate response
    return NextResponse.json(err, { status: 500 });
  }
};
