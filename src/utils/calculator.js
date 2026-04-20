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

  // Sort tiers by startMonth to ensure correctness
  const sortedTiers = [...tiers].sort((a, b) => a.startMonth - b.startMonth);

  let balance = principal;
  let month = 1;
  const schedule = [];
  let totalInterest = 0;
  
  // Prevent infinite loops (e.g., if payment is less than interest)
  const MAX_MONTHS = 1200; // 100 years max

  while (balance > 0 && month <= MAX_MONTHS) {
    // Find applicable interest rate for current month
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

    // Actual payment might be less in the final month
    const actualPayment = Math.min(monthlyPayment, balance + interestForMonth);
    const principalPaid = actualPayment - interestForMonth;

    balance -= principalPaid;
    // Handle floating point precision issues near zero
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
    },
    schedule
  };
}
