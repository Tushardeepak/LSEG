// Function to get bot optiions based on stages
export function getOptions(
  stockData, // All local stock data
  { stage, selectedStockExchange = null, selectedStockName = null }
) {
  if (!Array.isArray(stockData) || stockData.length === 0) {
    throw new Error("No stocks avaiable");
  }

  // Getting the stock data for selected stock exchange
  const stockExchange =
    selectedStockExchange &&
    stockData.find((se) => se.stockExchange === selectedStockExchange);

  switch (stage) {
    case 1:
      // Returning the array of all stock exchange options
      return stockData.map((stock) => {
        if (!stock.hasOwnProperty("stockExchange")) {
          throw new Error("Stock exchanges are not available");
        }
        return stock.stockExchange;
      });

    case 2:
      if (!stockExchange) {
        throw new Error(`Stock exchange '${selectedStockExchange}' not found`);
      }
      // Return all the top stocks array for selected stock exchange options
      return stockExchange.topStocks.map((stock) => {
        if (!stock.hasOwnProperty("stockName")) {
          throw new Error(
            `Stocks are not available for ${selectedStockExchange}`
          );
        }
        return stock.stockName;
      });

    case 3:
      if (!stockExchange) {
        throw new Error(`Stock exchange '${selectedStockExchange}' not found`);
      }
      // Return the price selected stock name
      const stockPrice = stockExchange.topStocks.find(
        (stock) => stock.stockName === selectedStockName
      );
      if (!stockPrice) {
        throw new Error(
          `Stock '${selectedStockName}' not found in '${selectedStockExchange}'`
        );
      }
      return [stockPrice.price];

    default:
      throw new Error("Invalid Step!");
  }
}

// Function to get bot header text based on stages
export const getHeaderText = (stage, value) => {
  switch (stage) {
    case 1:
      return "Please select a stock exchange.";
    case 2:
      return "Please select a stock.";
    case 3:
      return `Stock of ${value}. Please select an option`;
    default:
      return "Hello! Welcome to LSEG, I am here to help you.";
  }
};

// Funtion to get random loading time between 1000 to 2000
export const getMockLoadingTime = () => {
  const step = Math.floor(Math.random() * 9) + 1;
  return 1000 + step * 100;
};
