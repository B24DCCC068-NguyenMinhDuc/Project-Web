import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { FaUserInjured, FaUserMd, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';

// [SỬA LẠI ĐƯỜNG DẪN CSS] Lùi ra 2 cấp thư mục để tìm App.css
import '../../App.css'; 

function Home({ patients, doctors, appointments }) {

  // --- 1. TÍNH TOÁN SỐ LIỆU TỔNG QUAN ---
  const totalPatients = patients?.length || 0;
  const totalDoctors = doctors?.length || 0;
  const totalAppointments = appointments?.length || 0;
  
  const completedAppts = appointments?.filter(a => a.status === 'Hoàn thành') || [];
  
  const totalRevenue = completedAppts.reduce((sum, app) => {
      return sum + (parseFloat(app.fee) || 0); 
  }, 0);

  // --- 2. BIỂU ĐỒ CỘT THEO TUẦN (TUẦN HIỆN TẠI) ---
  const dataRevenue = useMemo(() => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      
      // Tính ngày đầu tuần (Thứ 2)
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const mondayDate = new Date(today);
      mondayDate.setDate(today.getDate() - daysFromMonday);
      mondayDate.setHours(0, 0, 0, 0);

      const daysMap = [
          { name: 'Thứ 2', revenue: 0, date: new Date(mondayDate) },
          { name: 'Thứ 3', revenue: 0, date: new Date(mondayDate) },
          { name: 'Thứ 4', revenue: 0, date: new Date(mondayDate) },
          { name: 'Thứ 5', revenue: 0, date: new Date(mondayDate) },
          { name: 'Thứ 6', revenue: 0, date: new Date(mondayDate) },
          { name: 'Thứ 7', revenue: 0, date: new Date(mondayDate) },
          { name: 'CN', revenue: 0, date: new Date(mondayDate) },
      ];

      // Set đúng ngày cho mỗi thứ
      for (let i = 0; i < 7; i++) {
          daysMap[i].date = new Date(mondayDate);
          daysMap[i].date.setDate(mondayDate.getDate() + i);
      }

      if (appointments && appointments.length > 0) {
          appointments.forEach(app => {
              if (app.status === 'Hoàn thành' && app.fee) {
                  try {
                      let date;
                      let dateStr = app.time_booked || app.time || '';
                      
                      // Format: "yyyy-MM-dd (HH:mm)" hoặc "yyyy-MM-dd HH:mm"
                      if (dateStr.includes('-')) {
                          const datePart = dateStr.split(' ')[0];
                          const [year, month, day] = datePart.split('-');
                          date = new Date(year, month - 1, day);
                      }
                      // Format: "dd/mm/yyyy (ca)"
                      else if (dateStr.includes('/')) {
                          const parts = dateStr.split(' ')[0].split('/');
                          date = new Date(parts[2], parts[1] - 1, parts[0]);
                      } else {
                          date = new Date(dateStr);
                      }
                      
                      date.setHours(0, 0, 0, 0);

                      // Kiểm tra ngày này có nằm trong tuần hiện tại không
                      const matchingDay = daysMap.find(d => 
                          d.date.getTime() === date.getTime()
                      );
                      
                      if (matchingDay) {
                          matchingDay.revenue += parseFloat(app.fee) || 0;
                      }
                  } catch (error) {
                      console.error('Lỗi parse date:', error);
                  }
              }
          });
      }

      // Trả về chỉ name và revenue (loại date)
      return daysMap.map(({ name, revenue }) => ({ name, revenue }));
  }, [appointments]);

  // --- 2B. BIỂU ĐỒ CỘT THEO THÁNG ---
  const dataRevenueMonth = useMemo(() => {
      const monthMap = {};
      
      if (appointments && appointments.length > 0) {
          appointments.forEach(app => {
              if (app.status === 'Hoàn thành' && app.fee) {
                  try {
                      let date;
                      let dateStr = app.time_booked || app.time || '';
                      
                      // Format: "yyyy-MM-dd (HH:mm)"
                      if (dateStr.includes('-')) {
                          const datePart = dateStr.split(' ')[0];
                          const [year, month, day] = datePart.split('-');
                          date = new Date(year, month - 1, day);
                      }
                      // Format: "dd/mm/yyyy (ca)"
                      else if (dateStr.includes('/')) {
                          const parts = dateStr.split(' ')[0].split('/');
                          date = new Date(parts[2], parts[1] - 1, parts[0]);
                      } else {
                          date = new Date(dateStr);
                      }
                      
                      if (!isNaN(date.getTime())) {
                          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                          const monthName = `T${date.getMonth() + 1}/${date.getFullYear()}`;
                          
                          if (!monthMap[monthKey]) {
                              monthMap[monthKey] = { name: monthName, revenue: 0 };
                          }
                          monthMap[monthKey].revenue += parseFloat(app.fee) || 0;
                      }
                  } catch (error) {
                      console.error('Lỗi parse date:', error);
                  }
              }
          });
      }
      
      return Object.values(monthMap).sort((a, b) => {
          const [aMonth, aYear] = a.name.split('/').map(Number);
          const [bMonth, bYear] = b.name.split('/').map(Number);
          // So sánh năm trước, sau đó so sánh tháng
          if (aYear !== bYear) return aYear - bYear;
          return aMonth - bMonth;
      }).slice(-12); // Lấy 12 tháng gần nhất
  }, [appointments]);

  // --- 3. BIỂU ĐỒ TRÒN ---
  const dataPie = useMemo(() => {
      if (!doctors || doctors.length === 0) return [];
      const stats = {};
      doctors.forEach(doc => {
          const spec = doc.specialty || 'Chưa rõ';
          stats[spec] = (stats[spec] || 0) + 1;
      });
      return Object.keys(stats).map(key => ({ name: key, value: stats[key] }));
  }, [doctors]);

  const generateColors = (length) => {
    const baseColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
    return Array.from({length}, (_, i) => baseColors[i % baseColors.length]);
  };
  const pieColors = generateColors(dataPie.length);

  const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div style={{
      background: 'white', 
      padding: '25px', 
      borderRadius: '12px',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)', 
      borderLeft: `5px solid ${color}`,
      border: `1px solid ${color}22`,
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    }}
    >
      <div>
        <p style={{ color: '#999', margin: '0 0 8px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
        <h3 style={{ margin: 0, fontSize: '26px', color: '#2c3e50', fontWeight: '800' }}>{value}</h3>
      </div>
      <div style={{ 
        width: '70px', 
        height: '70px', 
        borderRadius: '12px', 
        background: bg, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: color, 
        fontSize: '32px',
        flexShrink: 0,
        boxShadow: `0 4px 15px ${color}30`
      }}>
        <Icon />
      </div>
    </div>
  );

  return (
    <div className="home-container" style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h2 style={{ 
        marginBottom: '30px', 
        color: '#2c3e50', 
        borderBottom: '3px solid #667eea', 
        paddingBottom: '15px',
        fontSize: '28px',
        fontWeight: '800',
        letterSpacing: '-0.5px'
      }}>
        Tổng Quan Bệnh Viện
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard title="Tổng Doanh thu" value={`${(totalRevenue).toLocaleString('vi-VN')} đ`} icon={FaMoneyBillWave} color="#27ae60" bg="#d5f4e6" />
        <StatCard title="Tổng Bệnh nhân" value={totalPatients} icon={FaUserInjured} color="#3498db" bg="#d6eaf8" />
        <StatCard title="Tổng Lịch khám" value={totalAppointments} icon={FaCalendarCheck} color="#f39c12" bg="#fef5e7" />
        <StatCard title="Tổng Bác sĩ" value={totalDoctors} icon={FaUserMd} color="#e74c3c" bg="#fadbd8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginBottom: '20px' }}>
        {/* Biểu đồ cột doanh thu theo tuần */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ 
            margin: '0 0 25px 0', 
            color: '#2c3e50',
            fontSize: '18px',
            fontWeight: '700',
            borderBottom: '2px solid #667eea',
            paddingBottom: '10px'
          }}>
            📊 Doanh thu tuần này (VNĐ)
          </h4>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={dataRevenue} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#999"
                  style={{ fontSize: '13px', fontWeight: 500 }}
                />
                <YAxis 
                  stroke="#999"
                  style={{ fontSize: '13px' }}
                  tickFormatter={(value) => `${(value/1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '13px', fontWeight: 600 }}
                />
                <Bar 
                  dataKey="revenue" 
                  name="Doanh thu" 
                  fill="#667eea" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ tròn phân bố bác sĩ */}
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ 
            margin: '0 0 25px 0', 
            color: '#2c3e50',
            fontSize: '18px',
            fontWeight: '700',
            borderBottom: '2px solid #667eea',
            paddingBottom: '10px'
          }}>
            🏥 Phân bố Bác sĩ
          </h4>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={dataPie} 
                  cx="50%" 
                  cy="45%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  fill="#8884d8" 
                  paddingAngle={4} 
                  dataKey="value"
                  label={{ fontSize: 12, fontWeight: 600 }}
                  animationDuration={800}
                >
                  {dataPie.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={pieColors[index]}
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                  formatter={(value) => `${value} bác sĩ`}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Biểu đồ cột doanh thu theo tháng */}
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }}>
        <h4 style={{ 
          margin: '0 0 25px 0', 
          color: '#2c3e50',
          fontSize: '18px',
          fontWeight: '700',
          borderBottom: '2px solid #667eea',
          paddingBottom: '10px'
        }}>
          📈 Doanh thu 12 tháng gần nhất (VNĐ)
        </h4>
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <BarChart data={dataRevenueMonth} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                stroke="#999"
                style={{ fontSize: '12px', fontWeight: 500 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#999"
                style={{ fontSize: '13px' }}
                tickFormatter={(value) => `${(value/1000000).toFixed(0)}M`}
              />
              <Tooltip 
                formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '13px', fontWeight: 600 }}
              />
              <Bar 
                dataKey="revenue" 
                name="Doanh thu" 
                fill="#27ae60" 
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Home;