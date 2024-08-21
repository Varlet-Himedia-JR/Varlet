import React from 'react';

function TestContents() {
    return (
        <div className="flex flex-col w-full min-h-screen p-4 bg-gray-100">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col w-1/2 p-4 bg-white border rounded-md">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-semibold">Thêm/ chỉnh sửa phác đồ</h2>
              <div className="flex items-center space-x-2">
                <input type="text" placeholder="Độ tuổi từ" className="p-2 border rounded-md" />
                <button className="p-2 bg-blue-500 text-white rounded-md">Làm mới</button>
                <button className="p-2 bg-gray-300 rounded-md">Lọc</button>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border">Nhóm bệnh</th>
                  <th className="p-2 border">Tên vắc-xin</th>
                  <th className="p-2 border">Độ tuổi</th>
                  <th className="p-2 border">Hệ số</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Dại</td>
                  <td className="p-2 border">ABHAYRAB</td>
                  <td className="p-2 border">0 tuổi</td>
                  <td className="p-2 border">0,000</td>
                </tr>
                <tr>
                  <td className="p-2 border">Viêm gan B</td>
                  <td className="p-2 border">Heberbiovac 0.5ml</td>
                  <td className="p-2 border">0 tuổi</td>
                  <td className="p-2 border">0,000</td>
                </tr>
                <tr>
                  <td className="p-2 border">Dại</td>
                  <td className="p-2 border">Gene-Hibax</td>
                  <td className="p-2 border">0 tuổi</td>
                  <td className="p-2 border">0,000</td>
                </tr>
                {/* 추가 행 생략 */}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col w-1/2 p-4 bg-white border rounded-md">
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-semibold">Danh sách vắc-xin đã chọn</h2>
              <button className="p-2 bg-blue-500 text-white rounded-md">Chọn từ mẫu</button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border">STT</th>
                  <th className="p-2 border">Ngày hẹn tiêm</th>
                  <th className="p-2 border">Sử dụng</th>
                  <th className="p-2 border">Đơn giá</th>
                  <th className="p-2 border">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">1</td>
                  <td className="p-2 border">21/08/2024</td>
                  <td className="p-2 border">
                    <input type="checkbox" className="p-2 border rounded-md" defaultChecked />
                  </td>
                  <td className="p-2 border">390.000 đ</td>
                  <td className="p-2 border"></td>
                </tr>
                <tr>
                  <td className="p-2 border">2</td>
                  <td className="p-2 border">24/08/2024</td>
                  <td className="p-2 border">
                    <input type="checkbox" className="p-2 border rounded-md" defaultChecked />
                  </td>
                  <td className="p-2 border">390.000 đ</td>
                  <td className="p-2 border"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 mt-4 bg-white border rounded-md">
          <div className="flex items-center space-x-2">
            <span>Tổng mũi: 2</span>
            <span>Tiêm kéo dài trong: 4 ngày</span>
            <span>Số % thu thêm: 20%</span>
            <span>Tổng tiền: 780.000 đ</span>
          </div>
          <button className="p-2 bg-blue-500 text-white rounded-md">Kiểm tra CTKM</button>
        </div>
        <div className="flex items-center justify-between p-4 mt-4 bg-white border rounded-md">
          <button className="p-2 bg-gray-300 rounded-md">Lưu thành mẫu</button>
          <button className="p-2 bg-blue-500 text-white rounded-md">Thêm/Sửa</button>
        </div>
      </div>
    );
}

export default TestContents;
