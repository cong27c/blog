import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    fetch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/auth/verify?token=${token}`,
      {
        method: "POST",
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
        console.log("✅ Verify success:", data);
      })
      .catch((err) => {
        console.error("❌ Verify error:", err.message);
      });
  }, [token]);

  return (
    <div>
      <a href={`${import.meta.env.VITE_FRONTEND_URL}/`}>Quay về trang chủ</a>
    </div>
  );
}

export default VerifyEmail;
