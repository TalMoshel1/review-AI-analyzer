"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// טעינה דינמית של Recharts
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false },
);
const RadarChart = dynamic(() => import("recharts").then((m) => m.RadarChart), {
  ssr: false,
});
const Radar = dynamic(() => import("recharts").then((m) => m.Radar), {
  ssr: false,
});
const PolarGrid = dynamic(() => import("recharts").then((m) => m.PolarGrid), {
  ssr: false,
});
const PolarAngleAxis = dynamic(
  () => import("recharts").then((m) => m.PolarAngleAxis),
  { ssr: false },
);
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});

export default function ReviewAnalyzer() {
  const [reviews, setReviews] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const analyzeReviews = async () => {
    setLoading(true);
    setSelectedCategory(null); // איפוס בחירה קודמת
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews }),
      });
      const result = await res.json();
      console.log("Analysis Result:", result);
      setData(result);
    } catch (err) {
      alert("Error analyzing reviews");
    } finally {
      setLoading(false);
    }
  };

  const CustomizedTick = (props: any) => {
    const { x, y, payload } = props;
    const words = String(payload?.value ?? "").split(" ");
    const cx = 150;
    const cy = 120;
    const radiusOffset = 25;

    const angle = Math.atan2(y - cy, x - cx);
    const newX = x + Math.cos(angle) * radiusOffset;
    const newY = y + Math.sin(angle) * radiusOffset;

    return (
      <g transform={`translate(${newX},${newY})`}>
        <text
          textAnchor="middle"
          fill="#666"
          fontSize={10}
          className="font-medium"
        >
          {words.map((word: string, i: number) => (
            <tspan x="0" dy={i === 0 ? 0 : 11} key={i}>
              {word}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  if (!isClient) return null;

  return (
    <main className="min-h-screen bg-gray-50 text-black font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold border-b pb-4">
          LeanCon AI Review Summarizer
        </h1>

        <div className="space-y-2">
          <label className="block font-medium">Paste Reviews Here:</label>
          <textarea
            className="w-full h-40 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Paste multiple reviews here to analyze..."
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
          />
          <button
            onClick={analyzeReviews}
            disabled={loading || !reviews}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Analyzing with Llama 3..." : "Analyze with AI"}
          </button>
        </div>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {/* צד שמאל: גרף רדאר */}
            <div className="bg-white rounded-xl shadow-md border p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Visual Analysis
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={data.chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius="60%"
                  >
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={<CustomizedTick />}
                      stroke="none"
                    />
                    <Tooltip />
                    {/* <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      dot={{ r: 6, fill: "#2563eb", cursor: "pointer" }} // הוספת נקודות בולטות
                      activeDot={{
                        r: 8,
                        onClick: (e, payload) => {
                          // לחיצה על הנקודה הפעילה
                          if (payload && payload.payload)
                            setSelectedCategory(payload.payload);
                        },
                      }}
                      style={{ cursor: "pointer" }}
                      onClick={(data) => {
                        // לחיצה על השטח הכחול
                        if (data && data.payload) {
                          setSelectedCategory(data.payload);
                        }
                      }}
                    /> */}
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      dot={{ r: 6, fill: "#2563eb", cursor: "pointer" }}
                      activeDot={{
                        r: 8,
                        onClick: (e: any, payload: any) => {
                          // ב-activeDot, המידע נמצא בפרמטר השני (payload)
                          if (payload && payload.payload) {
                            setSelectedCategory(payload.payload);
                          }
                        },
                      }}
                      style={{ cursor: "pointer" }}
                      onClick={(data: any) => {
                        if (data && data.payload) {
                          setSelectedCategory(data.payload);
                        }
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Deep Dive Box */}
              <div className="mt-6 min-h-[100px] p-4 bg-blue-50 rounded-lg border border-blue-100">
                {/* {selectedCategory ? (
                  <div className="animate-in slide-in-from-bottom-2 duration-300">
                    <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">
                      {selectedCategory.subject}: {selectedCategory.score}/10
                    </h4>
                    <p className="text-gray-700 text-sm italic leading-relaxed">
                      "{selectedCategory.representativeReview}"
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs text-center py-6">
                    Click on the blue area of the chart to see specific review
                    snippets
                  </p>
                )} */}
                {selectedCategory ? (
                  <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-blue-800 uppercase">
                        {selectedCategory.subject}: {selectedCategory.score}/10
                      </h4>
                      {/* תגית שמסבירה שזה ניתוח מבוסס דאטה */}
                      <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                        AI LOGIC
                      </span>
                    </div>

                    {/* הסבר ה"מתמטיקה" מאחורי הציון */}
                    <p className="text-blue-900 text-xs font-medium leading-relaxed">
                      <span className="opacity-70">Analysis:</span>{" "}
                      {selectedCategory.reasoning}
                    </p>

                    {/* הציטוט המייצג */}
                    <div className="bg-white/50 p-2 rounded border border-blue-100">
                      <p className="text-gray-700 text-sm italic leading-relaxed">
                        "{selectedCategory.representativeReview}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs text-center py-6">
                    Click on the blue area of the chart to see the logic behind
                    the scores
                  </p>
                )}
              </div>
            </div>

            {/* צד ימין: תובנות טקסטואליות */}
            <div className="bg-white p-6 rounded-xl shadow-md border space-y-4">
              <h2 className="text-xl font-semibold">AI Insights</h2>
              <p className="text-gray-700 italic border-l-4 border-blue-500 pl-4 text-sm">
                {data.summary}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-green-600 font-bold uppercase text-xs mb-2">
                    Pros
                  </h3>
                  <ul className="text-sm space-y-1">
                    {data.pros.map((p: string, i: number) => (
                      <li key={i} className="flex items-start">
                        ✅ {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-red-600 font-bold uppercase text-xs mb-2">
                    Cons
                  </h3>
                  <ul className="text-sm space-y-1">
                    {data.cons.map((c: string, i: number) => (
                      <li key={i} className="flex items-start">
                        ❌ {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t text-center">
                <span className="text-3xl font-bold text-blue-600">
                  {data.sentimentScore}%
                </span>
                <p className="text-xs text-gray-500">Overall Satisfaction</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
