import { useState } from 'react';
import './index.css';
import './App.css';
import { calculateAmortization, findRequiredMonthlyPayment } from './utils/calculator';
import LoanForm from './components/LoanForm';
import SummaryCard from './components/SummaryCard';
import AmortizationTable from './components/AmortizationTable';
import { Calculator } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    calcMode: 'payment', // 'payment' or 'term'
    principal: 3000000,
    monthlyPayment: 15000,
    loanTermYears: 30,
    tiers: [
      { startMonth: 1, rate: 3.0 },
      { startMonth: 37, rate: 5.5 }
    ]
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = () => {
    setError(null);
    let calculationResult;
    
    if (formData.calcMode === 'payment') {
      calculationResult = calculateAmortization(
        formData.principal,
        formData.tiers,
        formData.monthlyPayment
      );
    } else {
      calculationResult = findRequiredMonthlyPayment(
        formData.principal,
        formData.tiers,
        formData.loanTermYears
      );
    }

    if (calculationResult.error) {
      setError(calculationResult.error);
      setResult(null);
    } else {
      setResult(calculationResult);
    }
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
            <Calculator size={48} />
          </div>
        </div>
        <h1 className="app-title text-gradient">เว็บคำนวณดอกเบี้ยบ้าน</h1>
        <p className="app-subtitle">คำนวณแบบลดต้นลดดอก รองรับดอกเบี้ยขั้นบันได</p>
      </header>

      <main className="calculator-grid">
        <div>
          <LoanForm 
            formData={formData} 
            setFormData={setFormData} 
            onCalculate={handleCalculate} 
          />
        </div>
        
        <div className="results-section">
          {error && (
            <div className="error-message animate-fade-in">
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <div>
                <strong>เกิดข้อผิดพลาดในการคำนวณ</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!error && result && (
            <>
              <SummaryCard summary={result.summary} />
              <AmortizationTable schedule={result.schedule} />
            </>
          )}

          {!error && !result && (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>กรุณาระบุข้อมูลสินเชื่อและกด "คำนวณยอดผ่อน" เพื่อดูผลลัพธ์</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
