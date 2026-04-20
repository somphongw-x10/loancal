import { Plus, Trash2 } from 'lucide-react';

export default function LoanForm({ formData, setFormData, onCalculate }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value) || value // Allow empty string for backspace
    }));
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...formData.tiers];
    newTiers[index][field] = Number(value) || value;
    setFormData((prev) => ({ ...prev, tiers: newTiers }));
  };

  const addTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1];
    const newStartMonth = lastTier ? Number(lastTier.startMonth) + 12 : 1;
    setFormData((prev) => ({
      ...prev,
      tiers: [...prev.tiers, { startMonth: newStartMonth, rate: 3.0 }]
    }));
  };

  const removeTier = (index) => {
    setFormData((prev) => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <form className="glass-panel form-section animate-fade-in" onSubmit={handleSubmit}>
      <h2 className="table-title" style={{ marginBottom: '1.5rem' }}>ข้อมูลสินเชื่อ</h2>
      
      <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input 
            type="radio" 
            name="calcMode" 
            value="payment" 
            checked={formData.calcMode === 'payment'} 
            onChange={(e) => setFormData(prev => ({...prev, calcMode: e.target.value}))} 
          />
          ระบุยอดผ่อนต่อเดือน
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input 
            type="radio" 
            name="calcMode" 
            value="term" 
            checked={formData.calcMode === 'term'} 
            onChange={(e) => setFormData(prev => ({...prev, calcMode: e.target.value}))} 
          />
          ระบุจำนวนปีที่กู้
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">ยอดเงินต้น (บาท)</label>
        <input
          type="number"
          name="principal"
          className="form-input"
          value={formData.principal}
          onChange={handleChange}
          min="1000"
          required
          placeholder="เช่น 3000000"
        />
      </div>

      {formData.calcMode === 'payment' ? (
        <div className="form-group">
          <label className="form-label">ยอดผ่อนชำระต่อเดือน (บาท)</label>
          <input
            type="number"
            name="monthlyPayment"
            className="form-input"
            value={formData.monthlyPayment}
            onChange={handleChange}
            min="100"
            required
            placeholder="เช่น 15000"
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
            * ยอดนี้ต้องมากกว่าดอกเบี้ยในแต่ละเดือน
          </small>
        </div>
      ) : (
        <div className="form-group">
          <label className="form-label">ระยะเวลาที่ต้องการผ่อน (ปี)</label>
          <input
            type="number"
            name="loanTermYears"
            className="form-input"
            value={formData.loanTermYears}
            onChange={handleChange}
            min="1"
            max="100"
            required
            placeholder="เช่น 30"
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
            * ระบบจะคำนวณค่างวดรายเดือนที่เหมาะสมให้
          </small>
        </div>
      )}

      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label className="form-label">อัตราดอกเบี้ยต่อปี (% แบบลดต้นลดดอก)</label>
        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem', display: 'block' }}>
          กำหนดดอกเบี้ยแบบขั้นบันได (เช่น เริ่มเดือนที่ 1 เรท 3%, เริ่มเดือนที่ 37 เรท 5%)
        </small>
        
        {formData.tiers.map((tier, index) => (
          <div key={index} className="tier-row">
            <div className="tier-input-group">
              <label>เริ่มเดือนที่</label>
              <input
                type="number"
                className="form-input"
                value={tier.startMonth}
                onChange={(e) => handleTierChange(index, 'startMonth', e.target.value)}
                min="1"
                required
                disabled={index === 0} // First tier always starts at month 1
              />
            </div>
            <div className="tier-input-group">
              <label>ดอกเบี้ย (%)</label>
              <input
                type="number"
                className="form-input"
                value={tier.rate}
                onChange={(e) => handleTierChange(index, 'rate', e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
            {index > 0 && (
              <button 
                type="button" 
                className="btn-icon" 
                onClick={() => removeTier(index)}
                title="ลบ"
              >
                <Trash2 size={18} />
              </button>
            )}
            {index === 0 && <div style={{width: '42px'}}></div>}
          </div>
        ))}
        
        <button type="button" className="add-tier-btn" onClick={addTier}>
          <Plus size={16} />
          เพิ่มช่วงดอกเบี้ย
        </button>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
        คำนวณยอดผ่อน
      </button>
    </form>
  );
}
