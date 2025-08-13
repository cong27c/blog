import { useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log(token);
  // LẤY TOKEN
  // FET RỒI ĐÍNH KÈM TOKEN LÊN

  fetch(`http://localhost:3000/api/v1/auth/verify?token=${token}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));

  return (
    <div>
      <a href="http://localhost:5173/">Quay về trang chủ</a>
    </div>
  );
}

export default VerifyEmail;
