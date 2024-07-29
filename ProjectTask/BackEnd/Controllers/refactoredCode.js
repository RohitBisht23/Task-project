const { getCombinedData } = require('../Controllers/productController');
const { getStatsStatus, getBarChartData, getPieChartData } = require('../Controllers/productController');

jest.mock('../Controllers/productController', () => ({
  ...jest.requireActual('../Controllers/productController'),
  getStatsStatus: jest.fn(),
  getBarChartData: jest.fn(),
  getPieChartData: jest.fn(),
}));

describe('getCombinedData', () => {
  it('should return combined data from all three APIs', async () => {
    const mockReq = { query: { month: '5', year: '2024' } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    getStatsStatus.mockResolvedValue({ success: true, data: { /* stats data */ } });
    getBarChartData.mockResolvedValue({ success: true, data: { /* bar chart data */ } });
    getPieChartData.mockResolvedValue({ success: true, data: { /* pie chart data */ } });

    await getCombinedData(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({
      success: true,
      message: 'Combined data from all three APIs',
      data: {
        stats: { /* stats data */ },
        barChart: { /* bar chart data */ },
        pieChart: { /* pie chart data */ }
      }
    });
  });
});
