// eslint-disable-next-line consistent-return
const calculateDays = (period, numberOfDays) => {
    /*
    * A function that receives the period type and integer count
    * and returns the total number of days
    * */
  
    if (period === 'days') {
      return numberOfDays;
    }
    if (period === 'weeks') {
      return numberOfDays * 7;
    }
    if (period === 'months') {
      return numberOfDays * 30;
    }
  };
  
  const floor = (value) => {
    if (value < 0) {
      return Math.floor(value) + 1;
    }
    return Math.floor(value);
  };
  const covid19ImpactEstimator = (data) => {
    /*
    * Challenge 1
    * */
  
    // Output
    const output = {
      data, // the input data you got
      impact: {}, // your best case estimation
      severeImpact: {} // your severe case estimation
    };
  
  
    // Derive currently infected people
    output.impact.currentlyInfected = Math.floor(data.reportedCases * 10);
  
    // Derive currently infected people for the severely infected
    output.severeImpact.currentlyInfected = Math.floor(data.reportedCases * 50);
  
    // Calculate Number of days
    const numberOfDays = calculateDays(data.periodType, data.timeToElapse);
  
    // Calculate Multiplication Factor
    const factor = Math.floor(numberOfDays / 3);
  
    // Estimate the number of infected people x days from now
    output.impact.infectionsByRequestedTime = output.impact.currentlyInfected * (2 ** factor);
  
    // Estimate the number of severely infected people x days from now
    const infectionsByRequestedTime = output.severeImpact.currentlyInfected * (2 ** factor);
    output.severeImpact.infectionsByRequestedTime = infectionsByRequestedTime;
  
    /*
    * Challenge 2
    * */
  
    // Estimated number of severe positive cases that will require hospitalization to recover.
    const value1 = floor(0.15 * output.impact.infectionsByRequestedTime);
    const value2 = floor(0.15 * output.severeImpact.infectionsByRequestedTime);
    output.impact.severeCasesByRequestedTime = value1;
    output.severeImpact.severeCasesByRequestedTime = value2;
  
    // 35% of hospital beds are available for COVID-19 patients
    const availableBeds = floor(0.35 * data.totalHospitalBeds);
  
    output.impact.hospitalBedsByRequestedTime = floor(availableBeds - value1);
    output.severeImpact.hospitalBedsByRequestedTime = floor(availableBeds - value2);
  
    /*
    * Challenge 3
    * */
  
    // Estimated number of severe positive cases that will require ICU care.
    const x1 = 0.05 * output.impact.infectionsByRequestedTime;
    const x2 = 0.05 * output.severeImpact.infectionsByRequestedTime;
    output.impact.casesForICUByRequestedTime = x1;
    output.severeImpact.casesForICUByRequestedTime = x2;
  
    // Estimated number of severe positive cases that will require ventilators.
    const y1 = 0.02 * output.impact.infectionsByRequestedTime;
    const y2 = 0.02 * output.severeImpact.infectionsByRequestedTime;
    output.impact.casesForVentilatorsByRequestedTime = floor(y1);
    output.severeImpact.casesForVentilatorsByRequestedTime = floor(y2);
  
    // Estimate how much money the economy is likely to lose daily, over the said period of time.
    const z1 = output.impact.infectionsByRequestedTime;
    const z2 = output.severeImpact.infectionsByRequestedTime;
    const dailyPop = data.region.avgDailyIncomePopulation;
    const dailyIncome = data.region.avgDailyIncomeInUSD;
  
  
    output.impact.dollarsInFlight = floor((z1 * dailyPop * dailyIncome) / numberOfDays);
  
    output.severeImpact.dollarsInFlight = floor((z2 * dailyPop * dailyIncome) / numberOfDays);
  
    // Return output object
    return output;
  };
  
  export default covid19ImpactEstimator;