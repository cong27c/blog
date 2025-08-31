import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function VerifySettingEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    fetch(
      `${import.meta.env.VITE_BASE_URL}/settings/email/verify?token=${token}`,
      {
        method: "GET", // nếu backend verify bằng GET
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Xác thực thất bại");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Verify setting success:", data);
      })
      .catch((err) => {
        console.error("❌ Verify setting error:", err.message);
      });
  }, [token]);

  return (
    <div>
      <a href={`${import.meta.env.VITE_FRONTEND_URL}/settings`}>
        Quay về trang cài đặt
      </a>
    </div>
  );
}

export default VerifySettingEmail;
