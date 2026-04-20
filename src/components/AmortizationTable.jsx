import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AmortizationTable({ schedule }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 12;

  if (!schedule || schedule.length === 0) return null;

  const totalPages = Math.ceil(schedule.length / rowsPerPage);
  const currentData = schedule.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const formatCurrency = (val) => val.toLocaleString('th-TH', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s', marginTop: '2rem' }}>
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">ตารางการผ่อนชำระ (ลดต้นลดดอก)</h2>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              ปีที่ {Math.floor((page * rowsPerPage) / 12) + 1}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn-outline" 
                style={{ padding: '0.5rem' }}
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                className="btn-outline" 
                style={{ padding: '0.5rem' }}
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <table className="amortization-table">
          <thead>
            <tr>
              <th>งวดที่</th>
              <th>ยอดชำระ (บาท)</th>
              <th>เงินต้น (บาท)</th>
              <th>ดอกเบี้ย ({currentData[0]?.interestRate}%)</th>
              <th>เงินต้นคงเหลือ (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.month}>
                <td style={{ textAlign: 'center' }}>{row.month}</td>
                <td style={{ color: 'var(--primary)', fontWeight: '500' }}>{formatCurrency(row.payment)}</td>
                <td style={{ color: 'var(--success)' }}>{formatCurrency(row.principalPaid)}</td>
                <td style={{ color: 'var(--danger)' }}>{formatCurrency(row.interestPaid)}</td>
                <td style={{ fontWeight: '500' }}>{formatCurrency(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          แสดงผลทีละ 12 งวด (1 ปี)
        </div>
      </div>
    </div>
  );
}
