import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GoalForm from "../components/GoalForm";
import GoalItem from "../components/GoalItem";
import Spinner from "../components/Spinner";
import {
  getTotalBalance,
  getBalance,
  reset,
} from "../features/balance/balanceSlice";
import { getGoals } from "../features/goals/goalSlice";
import PortfolioAssetTable from "../components/portfolioAssetTable/PortfolioAssetTable";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { portfolio, isLoading, isError, message } = useSelector(
    (state) => state.portfolio
  );

  const [marketPrice, setMarketPrice] = useState([]);
  const [bitcoinPrice, setBitcoinPrice] = useState("");
  const [ethereumPrice, setEthereumPrice] = useState([]);

  const getPriceData = (symbol) => {
    const url = "http://localhost:9000/api/marketdata/getcryptoprice/" + symbol;
    axios
      .get(url)
      .then((response) => {
        if (symbol == "btcgbp") {
          setBitcoinPrice(response.data.last);
        }else{
          setEthereumPrice(response.data.last)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const processPortfolio = (data) => {
    let proccessedPortfolio = [];
    let index = 0;

    const openQuantity = data.open;
    const symbol = data.symbol;
    const quantityFilled = data.quantityFilled;

    console.log(openQuantity);
    console.log(symbol);
    console.log(quantityFilled);

    console.log(bitcoinPrice);
    let price = 0;
    if (symbol == "BTC/GBP") {
      price = parseFloat(bitcoinPrice);
    } else if (symbol == "ETH/GBP") {
      price = parseFloat(ethereumPrice);
    }
    console.log("price: " + price);

    let portfolioData = {
      open: openQuantity,
      quantityFilled: quantityFilled,
      price: price,
      value: price * quantityFilled,
      symbol: symbol,
    };
    console.log(portfolioData);
    proccessedPortfolio.push(portfolioData);

    console.log("process");
    console.log(proccessedPortfolio);
    return proccessedPortfolio;
  };

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
    }
    getPriceData("btcgbp");
    getPriceData("ethgbp");

    dispatch(getTotalBalance());
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  console.log("here");
  console.log(bitcoinPrice)

  //const data = processPortfolio(portfolio);

  // on first sign in of user 1
  //const data = []

  //user 1 : jake goes back to main page
  const data = [{open: 7, quantityFilled: 0, price: bitcoinPrice, value: 0, symbol: "BTC/GBP"}]


  //user 2 : rich user signs in Quantity 28
  //const data = [{open: 0, quantityFilled: 28, price: bitcoinPrice, value: 28 * bitcoinPrice, symbol: "BTC/GBP"}]
  
  //user 2 : rich user after selling 7 bitcoin
  //const data = [{open: 0, quantityFilled: 21, price: bitcoinPrice, value: 21 * bitcoinPrice, symbol: "BTC/GBP"}]

  //back to user 1: sign back into jake
  //const data = [{open: 0, quantityFilled: 7, price: bitcoinPrice, value: 7 * bitcoinPrice, symbol: "BTC/GBP"}]

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
      </section>

      <section>
        
          <PortfolioAssetTable data={data} dispatch={dispatch} />
    
        
        
      </section>
    </>
  );
}

export default Dashboard;
