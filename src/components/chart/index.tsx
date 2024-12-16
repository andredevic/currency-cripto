import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistory {
  time: number;
  priceUsd: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

interface CryptoChartProps {
  criptoId: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ criptoId }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await axios.get(
          `https://api.coincap.io/v2/assets/${criptoId}/history?interval=d1`
        );

        const history: PriceHistory[] = response.data.data;

        // Criar labels e dados para o gráfico
        const labels = history.map((entry) =>
          new Date(entry.time).toLocaleDateString()
        );
        const prices = history.map((entry) => Number(entry.priceUsd));

        setChartData({
          labels,
          datasets: [
            {
              label: "Preço (USD)",
              data: prices,
              borderColor: "#fca311",
              backgroundColor: "#fca311",
              tension: 0.4,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados do gráfico:", err);
        setLoading(false);
      }
    }

    fetchChartData();
  }, [criptoId]);

  if (loading) return <p>Carregando gráfico...</p>;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `$${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return chartData ? (
    <div style={{ width: "100%", height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  ) : (
    <p>Erro ao carregar gráfico.</p>
  );
};

export default CryptoChart;
