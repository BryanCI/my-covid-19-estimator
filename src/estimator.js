const covid19ImpactEstimator = (data) => {
  /**
   * This is a function to discard the decimal part of the computations
   */
  const floor = (value) => Math.floor(value);

  // function to calculate the multiplication factor
  const calculateDays = (periodType, numberOfDays) => {
    if (periodType === 'months') {
      return numberOfDays * 30;
    }
    if (periodType === 'weeks') {
      return numberOfDays * 7;
    }

    return numberOfDays;
  };

  /**
   * Challenge 1
   */
  const input = data;
  const outPut = {
    data: input,
    impact: {},
    severeImpact: {}
  };

  const mild = outPut.impact;
  const severe = outPut.severeImpact;
  // calculate number of days
  const numberOfDays = calculateDays(input.periodType, input.timeToElapse);
  // method to calculate the factor
  const factor = 2 ** (numberOfDays / 3);


  // currently infected people
  mild.currentlyInfected = floor(input.reportedCases * 10);

  // severe impact inffected people
  severe.currentlyInfected = floor(input.reportedCases * 50);


  // infected people by requested time
  mild.infectionsByRequestedTime = floor(mild.currentlyInfected * factor);

  // severely infected people by time elapsed
  severe.infectionsByRequestedTime = floor(outPut.currentlyInfected * factor);

  /**
   * Challenge 2
   */

  // estimated number of severe cases that will need hospitalisation to recover
  mild.severeCasesByRequestedTime = floor(mild.infectionsByRequestedTime * 0.15);
  severe.severeCasesByRequestedTime = floor(severe.infectionsByRequestedTime * 0.15);

  // only 35 percent of hospital beds can be available for covid patients
  const presentBeds = floor(input.totalHospitalBeds * 0.35);

  mild.hospitalBedsByRequestedTime = (presentBeds - mild.severeCasesByRequestedTime);
  severe.hospitalBedsByRequestedTime = (presentBeds - severe.severeCasesByRequestedTime);

  /**
   * Challenge 3
   */

  // 5% of the infections by requested time that will require ICU
  mild.casesForICUByRequestedTime = floor(mild.infectionsByRequestedTime * 0.05);
  severe.casesForICUByRequestedTime = floor(severe.infectionsByRequestedTime * 0.05);

  // 2% of the infections by request time that will need ventilators
  mild.casesForVentilatorsByRequestedTime = floor(mild.infectionsByRequestedTime * 0.02);
  severe.casesForVentilatorsByRequestedTime = floor(severe.infectionsByRequestedTime * 0.02);

  // estimated amoumt of money the econmy is lossing per day
  const dollarsLost = input.avgDailyIncome * input.avgDailyIncomePopulation;

  mild.dollarsInFlight = floor((mild.infectionsByRequestedTime * dollarsLost) / numberOfDays);
  severe.dollarsInFlight = floor((severe.infectionsByRequestedTime * dollarsLost) / numberOfDays);
  // return object
  return outPut;
};

export default covid19ImpactEstimator;
