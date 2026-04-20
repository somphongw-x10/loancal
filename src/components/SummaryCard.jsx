export default function SummaryCard({ summary }) {
  if (!summary) return null;

  const { principal, totalInterest, totalPaid, payoffMonths } = summary;

  const formatCurrency = (val) => val.toLocaleString('th-TH', { maximumFractionDigits: 2 });
  
  const years = Math.floor(payoffMonths / 12);
  const months = payoffMonths % 12;
  const timeString = `${years > 0 ? `${years} ปี ` : ''}${months > 0 ? `${months} เดือน` : (years === 0 ? '0 เดือน' : '')}`;

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-label">ยอดเงินต้น</span>
          <span className="summary-value">{formatCurrency(principal)} ฿</span>
        </div>
        {summary.monthlyPayment && (
          <div className="summary-item">
            <span className="summary-label">ยอดผ่อนต่อเดือน</span>
            <span className="summary-value" style={{ color: '#8b5cf6' }}>{formatCurrency(summary.monthlyPayment)} ฿</span>
          </div>
        )}
        <div className="summary-item">
          <span className="summary-label">ดอกเบี้ยรวมทั้งหมด</span>
          <span className="summary-value danger">{formatCurrency(totalInterest)} ฿</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">รวมจ่ายทั้งสิ้น</span>
          <span className="summary-value primary">{formatCurrency(totalPaid)} ฿</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">ระยะเวลาผ่อนชำระ</span>
          <span className="summary-value">{timeString}</span>
        </div>
      </div>
    </div>
  );
}
