import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import * as XLSX from 'xlsx';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DataVisualizationProps {
  timeRange: string;
  category: string;
}

interface GraphData {
  name: string;
  value: number;
  platform?: string;
}

interface GraphDetails {
  title: string;
  description: string;
  type: 'line' | 'bar';
  data: GraphData[];
  metrics: Array<{
    label: string;
    value: string | number;
    change?: string;
  }>;
}

const COLORS = {
  mobile: '#3B82F6', // Blue
  web: '#10B981',    // Emerald
  app: '#F59E0B',    // Amber
  all: '#8B5CF6'     // Violet
};

const DataVisualization: React.FC<DataVisualizationProps> = ({ timeRange, category }) => {
  const [selectedGraph, setSelectedGraph] = useState<GraphDetails | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'mobile' | 'web' | 'app'>('all');
  const [graphs, setGraphs] = useState<GraphDetails[]>([]);

  useEffect(() => {
    const generateData = (days: number) => {
      const data: GraphData[] = [];
      const now = new Date();
      const platforms = ['mobile', 'web', 'app'];

      for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();

        if (selectedPlatform === 'all') {
          platforms.forEach(platform => {
            data.push({
              name: dateStr,
              value: Math.floor(Math.random() * 1000) + 500,
              platform
            });
          });
        } else {
          data.push({
            name: dateStr,
            value: Math.floor(Math.random() * 1000) + 500,
            platform: selectedPlatform
          });
        }
      }

      return data.reverse();
    };

    const days = timeRange === '1d' ? 24 : timeRange === '7d' ? 7 : timeRange === '15d' ? 15 : 30;
    const data = generateData(days);

    setGraphs([
      {
        title: 'User Activity',
        description: 'Daily active users across platforms',
        type: 'line',
        data: data.map(d => ({ ...d, value: Math.floor(d.value * 0.8) })),
        metrics: [
          {
            label: 'Total Active Users',
            value: data.reduce((sum, d) => sum + d.value, 0).toLocaleString(),
            change: '+12.5%'
          },
          {
            label: 'Average Daily Users',
            value: Math.floor(data.reduce((sum, d) => sum + d.value, 0) / days).toLocaleString(),
            change: '+8.3%'
          }
        ]
      },
      {
        title: 'User Retention',
        description: 'User retention rates over time',
        type: 'line',
        data: data.map(d => ({ ...d, value: Math.floor(Math.random() * 20) + 80 })),
        metrics: [
          {
            label: 'Peak Retention',
            value: '92%',
            change: '+5.2%'
          },
          {
            label: 'Average Retention',
            value: '85%',
            change: '+3.1%'
          }
        ]
      },
      {
        title: 'User Satisfaction',
        description: 'User satisfaction scores and trends',
        type: 'bar',
        data: data.map(d => ({ ...d, value: Math.floor(Math.random() * 20) + 80 })),
        metrics: [
          {
            label: 'Average Score',
            value: '4.5/5',
            change: '+0.3'
          },
          {
            label: 'Response Rate',
            value: '78%',
            change: '+4.2%'
          }
        ]
      },
      {
        title: 'User Engagement',
        description: 'Daily user engagement metrics',
        type: 'bar',
        data: data.map(d => ({ ...d, value: Math.floor(Math.random() * 1000) + 500 })),
        metrics: [
          {
            label: 'Total Sessions',
            value: data.reduce((sum, d) => sum + d.value, 0).toLocaleString(),
            change: '+15.7%'
          },
          {
            label: 'Average Session Duration',
            value: '12.5 min',
            change: '+2.3 min'
          }
        ]
      }
    ]);
  }, [timeRange, selectedPlatform]);

  const renderGraph = (graph: GraphDetails) => {
    const Chart = graph.type === 'line' ? LineChart : BarChart;
    const DataComponent: any = graph.type === 'line' ? Line : Bar;

    return (
      <div 
        className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        onClick={() => setSelectedGraph(graph)}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{graph.title}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={graph.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#4b5563"
                tick={{ fill: '#4b5563', fontSize: 12 }}
              />
              <YAxis 
                stroke="#4b5563"
                tick={{ fill: '#4b5563', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }}
                labelStyle={{ 
                  color: '#1f2937',
                  fontWeight: 600
                }}
                itemStyle={{ 
                  color: '#4b5563'
                }}
              />
              {selectedPlatform === 'all' ? (
                ['mobile', 'web', 'app'].map((platform, index) => (
                  <DataComponent
                    key={platform}
                    type="monotone"
                    dataKey="value"
                    data={graph.data.filter(d => d.platform === platform)}
                    stroke={COLORS[platform as keyof typeof COLORS]}
                    strokeWidth={2.5}
                    dot={{ 
                      fill: COLORS[platform as keyof typeof COLORS],
                      strokeWidth: 2,
                      r: 4
                    }}
                  />
                ))
              ) : (
                <DataComponent
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS[selectedPlatform]}
                  strokeWidth={2.5}
                  dot={{ 
                    fill: COLORS[selectedPlatform],
                    strokeWidth: 2,
                    r: 4
                  }}
                />
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderGraphDetails = () => {
    if (!selectedGraph) return null;

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedGraph.title}</h2>
            <button
              onClick={() => setSelectedGraph(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">{selectedGraph.description}</p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {selectedGraph.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">{metric.label}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    {metric.change && (
                      <span className={`ml-2 text-sm font-semibold ${
                        metric.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {metric.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Data Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    {selectedPlatform === 'all' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedGraph.data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.value}</td>
                      {selectedPlatform === 'all' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.platform}</td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index > 0 ? `${((item.value - selectedGraph.data[index - 1].value) / selectedGraph.data[index - 1].value * 100).toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Data Visualization</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPlatform === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setSelectedPlatform('mobile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPlatform === 'mobile'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Mobile
          </button>
          <button
            onClick={() => setSelectedPlatform('web')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPlatform === 'web'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Web
          </button>
          <button
            onClick={() => setSelectedPlatform('app')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              selectedPlatform === 'app'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            App
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {graphs.map((graph, index) => (
          <div key={index}>
            {renderGraph(graph)}
          </div>
        ))}
      </div>

      {renderGraphDetails()}
    </div>
  );
};

export default DataVisualization; 