'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportRaw = decodeURIComponent(searchParams.get('report') || '');

  // 🧹 Clean text and extract JSON part safely
  const cleanedReport = useMemo(() => {
    const jsonMatch = reportRaw.match(/\[\s*{[\s\S]*}\s*\]/); // match array JSON
    if (!jsonMatch) return null;
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }, [reportRaw]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-5xl border border-blue-100">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          🎯 Your Personalized Career Roadmap
        </h1>

        {/* ✅ Show cleaned structured data */}
        {Array.isArray(cleanedReport) ? (
          <div className="space-y-8 overflow-y-auto max-h-[75vh] px-2">
            {cleanedReport.map((item, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 hover:shadow-md transition"
              >
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  {item.career}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {item.roadmap?.map((step, i) => (
                    <li key={i} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          // fallback if JSON extraction fails
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner overflow-y-auto max-h-[75vh] whitespace-pre-wrap text-gray-800 leading-relaxed">
            {reportRaw}
          </div>
        )}

        <button
          onClick={() => router.push('/')}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200"
        >
          🔙 Back to Home
        </button>
      </div>
    </main>
  );
}
