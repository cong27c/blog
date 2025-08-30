import { useSearchParams } from "react-router-dom";

function VerifySettingEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // LẤY TOKEN
  // FET RỒI ĐÍNH KÈM TOKEN LÊN

  fetch(`http://localhost:3000/settings/email/verify?token=${token}`)
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));

  return (
    <div>
      <a href="http://localhost:5173/settings">Quay về trang cài đặt</a>
    </div>
  );
}

export default VerifySettingEmail;
