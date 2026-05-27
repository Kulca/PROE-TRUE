"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Star, MessageSquare, TrendingUp, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const claimsData = [
  { name: "Mon", claims: 45 },
  { name: "Tue", claims: 52 },
  { name: "Wed", claims: 48 },
  { name: "Thu", claims: 70 },
  { name: "Fri", claims: 61 },
  { name: "Sat", claims: 34 },
  { name: "Sun", claims: 40 },
];

const categoryData = [
  { name: "Skincare", value: 450 },
  { name: "Energy", value: 300 },
  { name: "Coffee", value: 250 },
  { name: "Wellness", value: 150 },
];

const sentimentData = [
  { name: "Positive", value: 75 },
  { name: "Neutral", value: 20 },
  { name: "Negative", value: 5 },
];

const COLORS = ["#D4772C", "#2C4B7D", "#2D8B4E", "#E5A83B", "#C44536"];

export default function BrandAnalyticsPage() {
  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif text-text-primary">Analytics & Feedback</h1>
          <p className="text-text-secondary">Understand how consumers are interacting with your samples.</p>
        </div>
        <Button variant="secondary">
          <Filter className="mr-2 h-4 w-4" /> Date Range
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Claims over time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Claims Over Time</CardTitle>
            <CardDescription>Daily claim counts for the past 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={claimsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6E1" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#9B9B9B" }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#9B9B9B" }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="claims" 
                    stroke="#D4772C" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "#D4772C", strokeWidth: 2, stroke: "#FFF" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Survey Sentiment */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Feedback Sentiment</CardTitle>
            <CardDescription>Consumer sentiment from recent surveys.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">+5% improvement</span>
              <span className="text-xs text-text-muted">this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Claims by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E6E1" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#1A1A1A" }}
                    width={80}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="value" fill="#2C4B7D" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-serif">Recent Feedback</CardTitle>
              <CardDescription>Latest comments from your testers.</CardDescription>
            </div>
            <MessageSquare className="h-5 w-5 text-text-muted" />
          </CardHeader>
          <CardContent className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
            {[
              { user: "Sarah M.", rating: 5, comment: "Absolutely loved the packaging! The product feels premium.", date: "2h ago" },
              { user: "David K.", rating: 4, comment: "Great texture. Would definitely buy once it launches.", date: "5h ago" },
              { user: "Leila B.", rating: 5, comment: "PUDO pickup was so easy. The energy bars are delicious!", date: "1d ago" },
              { user: "Mark S.", rating: 3, comment: "Decent coffee, but would prefer a stronger roast.", date: "2d ago" },
            ].map((feedback, i) => (
              <div key={i} className="p-3 rounded-card bg-bg-secondary/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{feedback.user}</span>
                  <span className="text-[10px] text-text-muted uppercase">{feedback.date}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < feedback.rating ? "text-warning fill-warning" : "text-border"}`} />
                  ))}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{feedback.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
