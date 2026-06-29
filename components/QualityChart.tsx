'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function QualityChart({ score }: { score: number }) {
  const data = [
    { name: 'Kesegaran', value: score },
    { name: 'Potensi Busuk', value: 100 - score },
  ];

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#8A8A8A" fontSize={10} />
          <YAxis stroke="#8A8A8A" fontSize={10} />
          <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: 'none' }} />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#E8A020' : '#C0392B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
