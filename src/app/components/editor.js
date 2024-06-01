"use client";
import React, { useState, useRef, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { ScaleLoader } from "react-spinners";
export default function Editor() {
  const [code, setCode] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [compileResults, setCompileResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = useCallback((value, viewUpdate) => {
    setCode(value);
  }, []);
  const handleAnalyzeCode = async () => {
    setAnalysisResults(null);
    setIsLoading(true);
    const data = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAnalysisResults(data);
      });
    const data2 = await fetch(
      process.env.NEXT_PUBLIC_COMPILE_URL +
        "/submissions/?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: code, language_id: 71 }),
      }
    );
    const result2 = await data2.json();
    setCompileResults(result2);
    console.log(result2);
    setIsLoading(false);
  };
  return (
    <div
      className="flex flex-row justify-center 
    "
    >
      <div className="w-[40vw] flex flex-col">
        {" "}
        <h1
          className="
          text-center
          text-white
          text-4xl
          font-bold
          p-4
          bg-gray-800
         
          
        "
        >
          Editor
        </h1>
        <CodeMirror
          value={code}
          height="60vh"
          className="dark"
          theme="dark"
          extensions={[langs.python()]}
          onChange={onChange}
        />
        <button
          onClick={handleAnalyzeCode}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Analyze
        </button>
      </div>
      <div className="w-[40vw] flex flex-col text-center">
        <h1 className="text-center text-white text-4xl font-bold p-4 bg-gray-800">
          Output
        </h1>
        <div
          className={
            isLoading
              ? "flex items-center justify-center h-[60vh]"
              : "p-4 bg-gray-700 text-white text-lg overflow-y-auto max-h-[60vh]"
          }
        >
          {analysisResults ? (
            <div>
              <ul>
                {analysisResults.results?.map((result) => (
                  <li
                    key={result.msg_id}
                    className="text-left border-b border-gray-600 py-2"
                  >
                    <b>
                      {result.msg} ({result.symbol})
                    </b>
                    <p className="font-bold text-red-500">
                      Line: {result.line}
                    </p>
                  </li>
                ))}
              </ul>
              <h1 className="text-center text-white text-2xl font-bold p-4">
                Compile Result
              </h1>
              <p className="text-left border-b border-gray-600 py-2">
                {"Status: " + compileResults.status?.description}
              </p>
              <p className="text-left border-b border-gray-600 py-2">
                {"Output: " + compileResults.stdout}
              </p>
              <p className="text-left border-b border-gray-600 py-2">
                {"Error: " + compileResults.stderr}
              </p>
              <p className="text-left border-b border-gray-600 py-2">
                {"Time taken" + compileResults.time + "s"}
              </p>
              <p className="text-left border-b border-gray-600 py-2">
                {compileResults.memory + "KB"}
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <ScaleLoader color="#36d7b7" />
            </div>
          ) : (
            <p>No analysis results yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
