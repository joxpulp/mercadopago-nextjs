import Script from "next/script";

declare global {
  interface Window {
    MercadoPago: any;
  }
}
export default function MercadoPago() {
  const executeMercadoPago = () => {
    const baseStyles = {
      height: "48px",
      padding: "13px",
    };

    const changeBorderColorFocus = (e: { field: string; }) => {
      document!.getElementById(e.field)!.style.borderColor = "#950EE1";
    };
    
    const changeBorderColorBlur = (e: { field: string; }) => {
      document!.getElementById(e.field)!.style.borderColor = "#000";
    };
    const mp = new window.MercadoPago(
      "TEST-12e0021e-da80-41e0-bf96-14d02ea8fe9c"
    );
    // Card number input
    mp.fields
      .create("cardNumber", {
        placeholder: "Rellena tarjeta",
        style: baseStyles,
      })
      .mount("cardNumber")
      .on("focus", changeBorderColorFocus)
      .on("blur", changeBorderColorBlur);
    // Expiration Date input
    mp.fields
      .create("expirationDate", {
        placeholder: "Expiration date",
        style: baseStyles,
      })
      .mount("expirationDate")
      .on("focus", changeBorderColorFocus)
      .on("blur", changeBorderColorBlur);
    // Security code input
    mp.fields
      .create("securityCode", {
        placeholder: "Codigo de seguridad",
        style: baseStyles,
      })
      .mount("securityCode")
      .on("focus", changeBorderColorFocus)
      .on("blur", changeBorderColorBlur);
  };

  return (
    <div className="m-[20px] w-[50%] flex flex-col gap-[13px]">
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        async
        onLoad={() => executeMercadoPago()}
      ></Script>
      <div
        id="cardNumber"
        className="w-full border border-black h-[48px] focus:border-red-500 outline-none"
      ></div>
      <div className="flex gap-[13px]">
        <div
          id="expirationDate"
          className="w-full border border-black h-[48px]"
        ></div>
        <div
          id="securityCode"
          className="w-full border border-black h-[48px]"
        ></div>
      </div>
    </div>
  );
}
