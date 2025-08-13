const crypto = require("crypto");

const JWT_SECRET =
    "1d48edc9e193aca0e09ecbaa12fa5bd9e78e15dfd57af14c16d1b02ec7628858";

const base64Encode = (string) => {
    const encoded = Buffer.from(string, "utf8").toString("base64");
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const base64Decode = (string) => {
    const buffer = Buffer.from(string, "base64");
    const decoded = buffer.toString("utf8");
    return decoded.replace(/-/g, "+").replace(/_/g, "/");
};

const generateSignature = (header, payload) => {
    const hmac = crypto.createHmac("sha256", JWT_SECRET);
    hmac.update(`${header}.${payload}`);
    const signature = hmac.digest("base64url");
    return signature;
};

const sign = (_payload, ttl = 3600) => {
    const header = base64Encode(
        JSON.stringify({
            alg: "HS256",
            typ: "JWT",
        })
    );
    const payload = base64Encode(
        JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + ttl,
            ..._payload,
        })
    );
    const signature = generateSignature(header, payload);
    const token = `${header}.${payload}.${signature}`;
    return token;
};

const verify = (token) => {
    const tokens = token.replace("Bearer ", "").split(".");
    const header = JSON.parse(base64Decode(tokens[0]));
    const payload = JSON.parse(base64Decode(tokens[1]));
    const tokenSign = tokens[2];

    const signature = generateSignature(tokens[0], tokens[1]);

    if (tokenSign !== signature) {
        return console.log(401, "Unauthorized");
    }

    const timestamps = Math.floor(Date.now() / 1000);

    if (timestamps > payload.exp) {
        return console.log("Hết hạn");
    }

    // const user = userService.findById(payload.userId);
    // req.user = user;

    // next();
};

const myToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTA3NzQxMTgsInVzZXJJZCI6MTB9.xSCeZcHK_UE80q0F8-7hb2YAg85oHKAxz2M3D0GMCp8`;
verify(myToken);
