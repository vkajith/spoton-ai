import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Building2, School, Hospital, Trees, UtensilsCrossed, Bus } from "lucide-react";
import { LocalityData } from "@/lib/types";
import { Button } from "./ui/button";

interface LocalityDetailsProps {
  locality: LocalityData;
  timeRange: number;
  onTimeRangeChange: (years: number) => void;
}

export function LocalityDetails({ locality, timeRange, onTimeRangeChange }: LocalityDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="mb-4">Appreciation Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 min-h-[400px]">
            {/* Left side - Chart */}
            <div className="w-1/2 border rounded-lg p-6">
              <p className="text-gray-600 mb-4">Average Appreciation</p>
              <div className="relative w-[300px] mx-auto">
                <svg className="w-full h-64" viewBox="0 0 300 180">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="35%" stopColor="#84cc16" />
                      <stop offset="65%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  
                  {/* Semi-circular track */}
                  <path
                    d="M45 150 A 105 105 0 0 1 255 150"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  
                  {/* Progress arc */}
                  <path
                    d="M45 150 A 105 105 0 0 1 255 150"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${Number(locality.rating) * 330 / 100} 330`}
                  />
                  
                  {/* Dots for visual reference */}
                  <circle cx="45" cy="150" r="3" fill="#94a3b8"/>
                  <circle cx="150" cy="45" r="3" fill="#94a3b8"/>
                  <circle cx="255" cy="150" r="3" fill="#94a3b8"/>
                  
                  {/* Value markers */}
                  <text x="35" y="170" className="text-xs" fill="#64748b">0%</text>
                  <text x="145" y="35" className="text-xs" fill="#64748b">50%</text>
                  <text x="255" y="170" className="text-xs" fill="#64748b">100%</text>
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-4">
                  <span className="text-5xl font-bold">{locality.rating}%</span>
                </div>
              </div>
              <p className="text-center text-lg font-medium text-gray-700 mt-6">Appreciation percentage</p>
              <p className="text-center text-sm text-gray-500">in next {timeRange} years</p>
            </div>

            {/* Right side - Details */}
            <div className="w-1/2 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Detail</h3>
              <div className="prose prose-sm max-w-none text-gray-600 max-h-[300px] overflow-y-auto px-4">
                <div className="space-y-4">
                  {locality.description.split(/(\d+(?:\.\d+)?%?)/).map((part, index) => (
                    <span key={index}>
                      {/\d+(?:\.\d+)?%?/.test(part) ? (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded mx-1">
                          {part}
                        </span>
                      ) : (
                        <span className="leading-relaxed">{part}</span>
                      )}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Highlights</h4>
                  <ul className="space-y-2 list-disc list-inside text-gray-600">
                    {locality.description
                      .split('.')
                      .filter(sentence => sentence.trim())
                      .slice(0, 3)
                      .map((highlight, index) => (
                        <li key={index} className="text-sm">
                          {highlight.trim()}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}