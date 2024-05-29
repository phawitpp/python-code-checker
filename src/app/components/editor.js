"use client";
import React, { useState, useRef, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { ScaleLoader } from "react-spinners";
export default function Editor() {
  const [code, setCode] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = useCallback((value, viewUpdate) => {
    setCode(value);
  }, []);
  const handleAnalyzeCode = () => {
    setAnalysisResults(null);
    setIsLoading(true);
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.json())
      .then((data) => {
        setAnalysisResults(data);
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setIsLoading(false));
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
            <ul>
              {analysisResults.results.map((result) => (
                <li
                  key={result.msg_id}
                  className="text-left border-b border-gray-600 py-2"
                >
                  <b>
                    {result.msg} ({result.symbol})
                  </b>
                  <p className="font-bold text-red-500">Line: {result.line}</p>
                </li>
              ))}
            </ul>
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
