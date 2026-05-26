
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { getBaseUrl } from "../../utils/baseURL";


const OrderSummary = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const products = useSelector((store) => store.cart.products);
  const { tax, taxRate, grandTotal, totalPrice, selectedItems } = useSelector((store) => store.cart)
  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const makeMoMoPayment = async () => {
    try {
      const amountVND = Math.round(grandTotal * 25000);
      if (amountVND < 1000) {
        window.alert("Số tiền thanh toán phải từ 1,000 VND trở lên.");
        return;
      }

      const body = {
        amount: amountVND,
        orderId: `order-${Date.now()}`,
        orderInfo: "Thanh toan don hang tu Lebaba Store",
      };

      const response = await fetch(`${getBaseUrl()}/api/orders/create-momo-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("MoMo Session:", data);

      if (data.payUrl) {
        window.location.href = data.payUrl; // Redirect to MoMo payment page
      } else {
        console.error("Failed to create MoMo payment session:", data);
        window.alert(`Không thể tạo phiên thanh toán MoMo: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (error) {
      console.error("Error making MoMo payment:", error);
      window.alert("Đã xảy ra lỗi khi kết nối tới server.");
    }
  };

  return (
    <div className=" bg-primary-light mt-5 rounded text-base">
      <div className="px-6 py-4 space-y-5">
        <h1 className="text-2xl font-bold text-dark">Tóm tắt đơn hàng</h1>
        <p className="text-dark mt-2">
          Sản phẩm đã chọn : {selectedItems}
        </p>
        <p className="text-dark mt-2">
          Tổng tiền hàng : ${totalPrice.toFixed(2)}
        </p>
        <p className="text-dark mt-2">
          Thuế ({taxRate * 100}%): ${tax.toFixed(2)}
        </p>
        <h3 className="font-semibold text-dark mt-4">
          Tổng cộng ${grandTotal.toFixed(2)}
        </h3>
      </div>
      <div className="px-4 pb-6">
        {" "}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClearCart();
          }}
          className="bg-red-500 px-3 py-1.5 text-white  mt-2 rounded-md flex justify-between items-center mb-4 w-full"
        >
          <span className="mr-2">Xóa giỏ hàng</span>

          <i className="ri-delete-bin-7-line"></i>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            makeMoMoPayment();
          }}
          className="bg-pink-600 px-3 py-1.5 text-white  mt-2 rounded-md flex justify-between items-center w-full"
        >
          <span className="mr-2">Thanh toán qua MoMo</span>
          <i className="ri-wallet-3-line"></i>
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;