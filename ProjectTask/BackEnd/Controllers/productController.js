require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('../Models/transactions');

const getAllTransaction = async (req, res) => {
  console.log("Hello rohit")
  try {
    console.log("You got a request");
    const { title, description, price, category, id, sold, select, sort, month, year } = req.query;
    const objectQuery = {};

    if (title) {
      objectQuery.title = { $regex: title, $options: 'i' };
    }

    if (description) {
      objectQuery.description = description;
    }

    if (price) {
      objectQuery.price = Number(price);
    }

    if (sold) {
      objectQuery.sold = sold === true; 
    }

    if (category) {
      objectQuery.category = category;
    }

    if (id) {
      objectQuery.id = Number(id);
    }

    const monthNum = month ? Number(month) : null;
    const yearNum = year ? Number(year) : null;

    let conditions = [];

    if (!monthNum && !yearNum) {
      conditions.push({ $eq: [{ $month: "$dateOfSale" }, 3] });
      conditions.push({ $eq: [{ $year: "$dateOfSale" }, 2022] });
    } else {
      if (monthNum) {
        conditions.push({ $eq: [{ $month: "$dateOfSale" }, monthNum] });
      }
      if (yearNum) {
        conditions.push({ $eq: [{ $year: "$dateOfSale" }, yearNum] });
      }
    }

    if (conditions.length > 0) {
      objectQuery.$expr = { $and: conditions };
    }

    console.log("Formed Query: ", JSON.stringify(objectQuery));
    let apiData = Transaction.find(objectQuery);

    if (sort) {
      let sortFix = sort.split(",").join(" ");
      apiData = apiData.sort(sortFix);
    }

    if (select) {
      let selectFix = select.split(",").join(" ");
      apiData = apiData.select(selectFix);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    apiData = apiData.skip(skip).limit(limit);

    const allTransaction = await apiData;

    if (!allTransaction || allTransaction.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No transactions found",
      });
    }

    console.log("Data is ---->", allTransaction);
    return res.status(200).send({
      success: true,
      message: "All transactions are found.",
      allTransaction,
      nbHits: allTransaction.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server Error",
      error,
    });
  }
};


const getStatsStatus = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Check if at least month or year is provided
    if (!month && !year) {
      return res.status(400).send({
        success: false,
        message: "At least month or year must be provided",
      });
    }

    // Convert month and year to numbers to remove leading zeros
    const monthNum = month ? Number(month) : null;
    const yearNum = year ? Number(year) : null;

    // Build the query conditionally
    let conditions = [];
    if (monthNum) {
      conditions.push({ $eq: [{ $month: "$dateOfSale" }, monthNum] });
    }
    if (yearNum) {
      conditions.push({ $eq: [{ $year: "$dateOfSale" }, yearNum] });
    }

    const objectQuery = {
      $expr: {
        $and: conditions
      }
    };

    const transactions = await Transaction.find(objectQuery);

    if (!transactions || transactions.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No transactions found for the selected period",
      });
    }

    // Calculate statistics
    const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
    const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
    const totalNotSoldItems = transactions.length - totalSoldItems;

    return res.status(200).send({
      success: true,
      message: `Statistics for the selected period`,
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server Error",
      error,
    });
  }
}


// API pie chart data
const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;

    //Validation added if month is not present
    if (!month) {
      return res.status(400).send({
        success: false,
        message: "Month must be provided",
      });
    }

    // As month will be in string, so convert it in Number
    const monthNum = Number(month);

    // Build the query conditionally
    const objectQuery = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthNum]
      }
    };

    const transactions = await Transaction.find(objectQuery);

    if (!transactions || transactions.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No transactions found for the selected month",
      });
    }

    // Calculate pie chart data
    const categoryCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.keys(categoryCounts).map(category => ({
      category,
      count: categoryCounts[category]
    }));

    return res.status(200).send({
      success: true,
      message: `Pie chart data for month ${month}`,
      categories,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server Error",
      error,
    });
  }
}


const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;

    //Validation
    if (!month) {
      return res.status(400).send({
        success: false,
        message: "Month must be provided",
      });
    }

    // String to Number conversion
    const monthNum = Number(month);

    // Build the query conditionally
    const objectQuery = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthNum]
      }
    };

    const transactions = await Transaction.find(objectQuery);

    if (!transactions || transactions.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No transactions found for the selected month",
      });
    }

    // Calculate bar chart data
    const priceRanges = [
      { range: '0-100', count: 0 },
      { range: '101-200', count: 0 },
      { range: '201-300', count: 0 },
      { range: '301-400', count: 0 },
      { range: '401-500', count: 0 },
      { range: '501-600', count: 0 },
      { range: '601-700', count: 0 },
      { range: '701-800', count: 0 },
      { range: '801-900', count: 0 },
      { range: '901-above', count: 0 },
    ];

    transactions.forEach(transaction => {
      const price = transaction.price;
      if (price <= 100) priceRanges[0].count++;
      else if (price <= 200) priceRanges[1].count++;
      else if (price <= 300) priceRanges[2].count++;
      else if (price <= 400) priceRanges[3].count++;
      else if (price <= 500) priceRanges[4].count++;
      else if (price <= 600) priceRanges[5].count++;
      else if (price <= 700) priceRanges[6].count++;
      else if (price <= 800) priceRanges[7].count++;
      else if (price <= 900) priceRanges[8].count++;
      else priceRanges[9].count++;
    });

    return res.status(200).send({
      success: true,
      message: `Bar chart data for month ${month}`,
      priceRanges,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server Error",
      error,
    });
  }
}


const getCombinedData = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Fetch statistics
    const statsResponse = await getStatsStatus(req, res);
    if (!statsResponse.success) {
      return res.status(400).send(statsResponse);
    }

    // Fetch bar chart data
    const barChartResponse = await getBarChartData(req, res);
    if (!barChartResponse.success) {
      return res.status(400).send(barChartResponse);
    }

    // Fetch pie chart data
    const pieChartResponse = await getPieChartData(req, res);
    if (!pieChartResponse.success) {
      return res.status(400).send(pieChartResponse);
    }

    // Combine all responses
    const combinedResponse = {
      success: true,
      message: 'Combined data from all three APIs',
      data: {
        stats: statsResponse.data,
        barChart: barChartResponse.data,
        pieChart: pieChartResponse.data
      }
    };

    // Log combinedResponse to identify potential circular references
    console.log(JSON.stringify(combinedResponse, null, 2));

    return res.status(200).send(combinedResponse);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).send({
        success: false,
        message: 'Server Error',
        error,
      });
    }
  }
};




module.exports = { getAllTransaction, getStatsStatus, getPieChartData, getBarChartData, getCombinedData };
