import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CoinProps } from "../home";
import Styles from "./detail.module.css";
import CryptoChart from "../../components/chart";

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

const DetailPage = () => {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinProps>();
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_API_KEY
  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=${apiKey}`)
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }
            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(
                Number(data.data.marketCapUsd)
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };

            setCoin(resultData);
            setLoading(false);
          });
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    }

    getCoin();
  }, [cripto]);

  if (loading || !coin) {
    <div className={Styles.container}>
      <h4 className={Styles.center}>Carregando detalhes...</h4>
    </div>;
  }

  return (
    <div className={Styles.container}>

      <section className={Styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLocaleLowerCase()}@2x.png`}
          alt="logo da moeda"
          className={Styles.Logo}
        />

        <h1 className={Styles.name}>
          {coin?.name} | {coin?.symbol}
        </h1>
        <p>
          <strong>Preço hoje: </strong>
          {coin?.formatedPrice}
        </p>
        <a>
          <strong>Mercado: </strong> {coin?.formatedMarket}
        </a>
        <a>
          <strong>Volume: </strong> {coin?.formatedVolume}
        </a>
        <a>
          <strong>Mudança 24h: </strong>
          <span
            className={
              Number(coin?.changePercent24Hr) > 0 ? Styles.profit : Styles.loss
            }
          >
            {Number(coin?.changePercent24Hr).toFixed(2)}
          </span>
        </a>
        <div className={Styles.chartContainer}>
        <h2>Histórico de Preços (USD)</h2>
        <CryptoChart criptoId={cripto!} />
      </div>
      </section>

    </div>
  );
};

export default DetailPage;
