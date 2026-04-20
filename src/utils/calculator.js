/**
 * Calculates the amortization schedule based on reducing balance method.
 * 
 * @param {number} principal - The initial loan amount
 * @param {Array} tiers - Array of interest rate tiers, e.g., [{ startMonth: 1, rate: 3.0 }, { startMonth: 37, rate: 5.5 }]
 * @param {number} monthlyPayment - The desired monthly payment amount
 * @returns {Object} - Object containing the summary and the detailed schedule.
 */
export function calculateAmortization(principal, tiers, monthlyPayment) {
  if (!principal || principal <= 0 || !monthlyPayment || monthlyPayment <= 0 || !tiers || tiers.length === 0) {
    return { error: "กรุณาระบุข้อมูลให้ครบถ้วนและถูกต้อง" };
  }

  const sortedTiers = [...tiers].sort((a, b) => a.startMonth - b.startMonth);

  let balance = principal;
  let month = 1;
  const schedule = [];
  let totalInterest = 0;
  
  const MAX_MONTHS = 1200; // 100 years max

  while (balance > 0 && month <= MAX_MONTHS) {
    let currentRate = sortedTiers[0].rate;
    for (let i = sortedTiers.length - 1; i >= 0; i--) {
      if (month >= sortedTiers[i].startMonth) {
        currentRate = sortedTiers[i].rate;
        break;
      }
    }

    const monthlyInterestRate = (currentRate / 100) / 12;
    const interestForMonth = balance * monthlyInterestRate;

    if (monthlyPayment <= interestForMonth && balance > 0) {
      return { 
        error: `ยอดผ่อนชำระต่อเดือน (${monthlyPayment.toLocaleString()} บาท) น้อยกว่าดอกเบี้ยในเดือนที่ ${month} (${interestForMonth.toLocaleString(undefined, {maximumFractionDigits:2})} บาท) ทำให้ไม่สามารถผ่อนหมดได้` 
      };
    }

    const actualPayment = Math.min(monthlyPayment, balance + interestForMonth);
    const principalPaid = actualPayment - interestForMonth;

    balance -= principalPaid;
    if (balance < 0.01) balance = 0;

    totalInterest += interestForMonth;

    schedule.push({
      month,
      payment: actualPayment,
      principalPaid,
      interestPaid: interestForMonth,
      remainingBalance: balance,
      interestRate: currentRate
    });

    month++;
  }

  if (balance > 0) {
    return { error: "ระยะเวลาผ่อนชำระเกิน 100 ปี กรุณาเพิ่มยอดผ่อนชำระต่อเดือน" };
  }

  return {
    summary: {
      principal,
      totalInterest,
      totalPaid: principal + totalInterest,
      payoffMonths: schedule.length,
      monthlyPayment: schedule[0]?.payment || monthlyPayment // Export initial payment amount
    },
    schedule
  };
}

function simulateBalance(principal, sortedTiers, monthlyPayment, targetMonths) {
  let balance = principal;
  for (let month = 1; month <= targetMonths; month++) {
    let currentRate = sortedTiers[0].rate;
    for (let i = sortedTiers.length - 1; i >= 0; i--) {
      if (month >= sortedTiers[i].startMonth) {
        currentRate = sortedTiers[i].rate;
        break;
      }
    }
    const monthlyInterest = balance * (currentRate / 100) / 12;
    if (monthlyPayment <= monthlyInterest) return Infinity;
    const principalPaid = monthlyPayment - monthlyInterest;
    balance -= principalPaid;
    if (balance <= 0) {
      return month < targetMonths ? -1 : 0; 
    }
  }
  return balance;
}

export function findRequiredMonthlyPayment(principal, tiers, targetYears) {
  if (!principal || principal <= 0 || !targetYears || targetYears <= 0 || !tiers || tiers.length === 0) {
    return { error: "กรุณาระบุข้อมูลให้ครบถ้วนและถูกต้อง" };
  }

  const targetMonths = targetYears * 12;
  const sortedTiers = [...tiers].sort((a, b) => a.startMonth - b.startMonth);

  let minPayment = principal / targetMonths;
  let maxRate = Math.max(...tiers.map(t => t.rate));
  let monthlyMaxRate = (maxRate / 100) / 12;
  let maxPayment = monthlyMaxRate > 0 
    ? principal * (monthlyMaxRate * Math.pow(1 + monthlyMaxRate, targetMonths)) / (Math.pow(1 + monthlyMaxRate, targetMonths) - 1)
    : minPayment;

  if (isNaN(maxPayment) || maxPayment === Infinity) maxPayment = principal;

  let payment = (minPayment + maxPayment) / 2;

  for (let iter = 0; iter < 100; iter++) {
    const finalBalance = simulateBalance(principal, sortedTiers, payment, targetMonths);
    if (finalBalance === Infinity || finalBalance > 0.01) {
      minPayment = payment; 
    } else if (finalBalance === -1) {
      maxPayment = payment; 
    } else {
      break;
    }
    payment = (minPayment + maxPayment) / 2;
  }
  
  // Round up to nearest 100 (standard bank practice)
  const finalPayment = Math.ceil(payment / 100) * 100;
  
  // Calculate amortization with this found payment
  return calculateAmortization(principal, tiers, finalPayment);
}
